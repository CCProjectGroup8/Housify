import os
import sys
import findspark
findspark.init()
from pyspark import SparkConf, SparkContext
from pyspark.mllib.recommendation import ALS
import math
import boto3
import getRes
import knn
import config as key
import log
import time

dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id = key.aws['accessKeyId'],
                          aws_secret_access_key = key.aws['secretAccessKey'],
                          region_name = 'us-east-1'
                          )
recommendtable= dynamodb.Table('recommendresult')

	
	
# get table heree

seed = 5L
best_rank = 8
iterations = 10
regularization_parameter = 0.1

sc = SparkContext()
datasets_path = os.path.join('.', 'data')

# Load the complete dataset file
complete_ratings_file = os.path.join(datasets_path, 'comments.csv')
complete_ratings_raw_data = sc.textFile(complete_ratings_file)
complete_ratings_raw_data_header = complete_ratings_raw_data.take(1)[0]

# Parse
complete_ratings_data = complete_ratings_raw_data.filter(lambda line: line!=complete_ratings_raw_data_header)\
    .map(lambda line: line.split(",")).map(lambda tokens: (int(tokens[0]),int(tokens[1]),float(tokens[2]))).cache()

print "There are %s recommendations in the complete dataset" % (complete_ratings_data.count())

training_RDD, test_RDD = complete_ratings_data.randomSplit([7, 3], seed=0L)

complete_model = ALS.train(training_RDD, best_rank, seed=seed,
                           iterations=iterations, lambda_=regularization_parameter)

test_for_predict_RDD = test_RDD.map(lambda x: (x[0], x[1]))

predictions = complete_model.predictAll(test_for_predict_RDD).map(lambda r: ((r[0], r[1]), r[2]))
rates_and_preds = test_RDD.map(lambda r: ((int(r[0]), int(r[1])), float(r[2]))).join(predictions)
error = math.sqrt(rates_and_preds.map(lambda r: (r[1][0] - r[1][1])**2).mean())

print 'For testing data the RMSE is %s' % (error)
print "predictions =  ", predictions
print "rates_and_preds = ", rates_and_preds

complete_movies_file = os.path.join(datasets_path, 'house.csv')
complete_movies_raw_data = sc.textFile(complete_movies_file)
complete_movies_raw_data_header = complete_movies_raw_data.take(1)[0]

complete_movies_data = complete_movies_raw_data.filter(lambda line: line!=complete_movies_raw_data_header).map(lambda line: line.split(",")).map(lambda tokens: (int(tokens[0]),tokens[1])).cache()
complete_movies_titles = complete_movies_data.map(lambda x: (int(x[0]),x[1]))
print "There are %s movies in the complete dataset" % (complete_movies_titles.count())


def get_counts_and_averages(ID_and_ratings_tuple):
    nratings = len(ID_and_ratings_tuple[1])
    return ID_and_ratings_tuple[0], (nratings, float(sum(x for x in ID_and_ratings_tuple[1]))/nratings)

movie_ID_with_ratings_RDD = (complete_ratings_data.map(lambda x: (x[1], x[2])).groupByKey())
movie_ID_with_avg_ratings_RDD = movie_ID_with_ratings_RDD.map(get_counts_and_averages)
movie_rating_counts_RDD = movie_ID_with_avg_ratings_RDD.map(lambda x: (x[0], x[1][0]))
		

while True:
	result = getRes.getRes()
	
	for key in result:		
		new_user_ID = key
		
		new_user_ratings = result[key]
		
		new_user_ratings_RDD = sc.parallelize(new_user_ratings)
		print 'New user ratings: %s' % new_user_ratings_RDD.take(10)
		
		complete_data_with_new_ratings_RDD = complete_ratings_data.union(new_user_ratings_RDD)
		
		new_ratings_model = ALS.train(complete_data_with_new_ratings_RDD, best_rank, seed=seed, 
		                              iterations=iterations, lambda_=regularization_parameter)
		
		new_user_ratings_ids = map(lambda x: x[1], new_user_ratings) # get just movie IDs
		# keep just those not on the ID list (thanks Lei Li for spotting the error!)
		new_user_unrated_movies_RDD = (complete_movies_data.filter(lambda x: x[0] not in new_user_ratings_ids).map(lambda x: (new_user_ID, x[0])))
		
		# Use the input RDD, new_user_unrated_movies_RDD, with new_ratings_model.predictAll() to predict new ratings for the movies
		new_user_recommendations_RDD = new_ratings_model.predictAll(new_user_unrated_movies_RDD)
		
		# Transform new_user_recommendations_RDD into pairs of the form (Movie ID, Predicted Rating)
		new_user_recommendations_rating_RDD = new_user_recommendations_RDD.map(lambda x: (x.product, x.rating))
		print new_user_recommendations_rating_RDD.take(5)
		new_user_recommendations_rating_title_and_count_RDD = \
		    new_user_recommendations_rating_RDD.join(complete_movies_titles).join(movie_rating_counts_RDD)
		new_user_recommendations_rating_title_and_count_RDD.take(3)
		
		new_user_recommendations_rating_title_and_count_RDD = \
		    new_user_recommendations_rating_title_and_count_RDD.map(lambda r: (r[1][0][1], r[1][0][0], r[1][1]))
		    
		#top_movies = new_user_recommendations_rating_title_and_count_RDD.filter(lambda r: r[2]>=25).takeOrdered(25, key=lambda x: -x[1])
		top_movies = new_user_recommendations_rating_RDD.takeOrdered(25, key=lambda x: -x[1])
		
		
		print map(str, top_movies)
		
		for i in xrange(len(top_movies)):
			pass
		#	print top_movies[i][1]	
			
		
		#top_movies = new_user_recommendations_rating_RDD.takeOrdered(25, key=lambda x: -x[1])
		#
		#print top_movies
		
		recresult = {
			'username' : key
		}
		recresult['recommendation'] = {}
		
	#	recresult['recommendation']['houseId'] = []
	#	recresult['recommendation']['score'] = []
	#
	#	for item in result[key]:
	#		recresult['recommendation']['houseId'].append(item[1])
	#		recresult['recommendation']['score'].append(item[2])

		houseId = []
		score = []

		for item in result[key]:
			houseId.append(item[1])
			score.append(item[2])

		houseId = [x for (y, x) in sorted(zip(score, houseId))]
		score = sorted(score)
		
		recresult['recommendation']['houseId'] = houseId[::-1]
		recresult['recommendation']['score'] = score[::-1]
		
		print "putrecommend for"
		print recresult['recommendation']
		response = recommendtable.put_item(
			Item = recresult
		)		
	
	knn.recommend()
	print "into sleep"
	time.sleep(30)
