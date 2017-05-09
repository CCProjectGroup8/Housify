# encoding=utf8
import boto3
import sys
import datetime
from decimal import *
from sklearn.neighbors import KNeighborsClassifier
import config as key

def recommend():
	# def getRes():
	
	reload(sys)
	sys.setdefaultencoding('utf8')
	
	context = Context(prec=2, rounding=ROUND_UP)
	
	# Get service resource
	dynamodb = boto3.resource('dynamodb',
	                          aws_access_key_id = key.aws['accessKeyId'],
	                          aws_secret_access_key = key.aws['secretAccessKey'],
	                          region_name = 'us-east-1'
	                          )
	usertable = dynamodb.Table('user')
	rectalbe = dynamodb.Table('recommendresult')
	
	
	# return user result
	result = []
	
	# sklearn KNN, training data
	X = []
	y = []
	neigh = KNeighborsClassifier(n_neighbors = 3)
	
	response = usertable.scan()
	for i in response['Items']:
	    try:
	        if i['isNew'] == False:
	
	            # get features
	            features = []
	            if i['sex'] == 'Male':
	                sex = 1
	            else:
	                sex = 0
	            features.append(sex)
	
	            birth_year = i['dob'].split("-")[0]
	            current_year = datetime.datetime.now().year
	            age = int(current_year) - int(birth_year)
	            features.append(age)
	
	            # get labels
	            X.append(features)
	            y.append(i['userId'])
	    except:
	        continue
	
	
	while 'LastEvaluatedKey' in response:
	  response = usertable.scan(
	  ExclusiveStartKey=response['LastEvaluatedKey']
	  )
	  for i in response['Items']:
	      try:
	          if i['isNew'] == False:
	              # get features
	              features = []
	              if i['sex'] == 'Male':
	                  sex = 1
	              else:
	                  sex = 0
	              features.append(sex)
	
	              birth_year = i['dob'].split("-")[0]
	              current_year = datetime.datetime.now().year
	              age = int(current_year) - int(birth_year)
	              features.append(age)
	
	              # get labels
	              X.append(features)
	              y.append(i['userId'])
	      except:
	          continue
	
	neigh.fit(X, y)
	
	
	# predict nearest neighbor for user
	for i in response['Items']:
	    try:
	        if i['isNew'] == True:
	            # get features
	            f_new = []
	            if i['sex'] == 'Male':
	                sex = 1
	            else:
	                sex = 0
	            f_new.append(sex)
	
	            birth_year = i['dob'].split("-")[0]
	            current_year = datetime.datetime.now().year
	            age = int(current_year) - int(birth_year)
	            f_new.append(age)
	
	            print "neighbor for"
	            print i['userId']
	
	            x_new = []
	            x_new.append(f_new)
	            neighbor = neigh.predict(x_new)[0]
	
	            # prediction result
	            pred = (i['userId'], neighbor)
	            print pred
	
	            # get recommendation for neightbor, and copy house reco
	            response2 = rectalbe.scan()
	            for j in response2['Items']:
	                try:
	                    if neighbor == j['username']:
	                        copyresult = j['recommendation']
	                    itempredict = {
	                        'username' : i['userId'],
	                        'recommendation': copyresult
	                    }
	                    print "itempredict"
	                    print itempredict
	                    response = rectalbe.put_item(
	                        Item=itempredict
	                    )
	                except:
	                    continue
	
	            while 'LastEvaluatedKey' in response2:
	                response2 = rectalbe.scan(
	                    ExclusiveStartKey=response2['LastEvaluatedKey']
	                )
	                for j in response2['Items']:
	                    try:
	                        if neighbor == j['username']:
	                            copyresult = j['recommendation']
	                        itempredict = {
	                            'username': i['userId'],
	                            'recommendation': copyresult
	                        }
	                        print "itempredict"
	                        print itempredict
	                        response = rectalbe.put_item(
	                            Item=itempredict
	                        )
	
	                    except:
	                        continue
	
	    except:
	        continue
	
	
	while 'LastEvaluatedKey' in response:
	  response = usertable.scan(
	  ExclusiveStartKey=response['LastEvaluatedKey']
	  )
	  for i in response['Items']:
	      try:
	          if i['isNew'] == True:
	              # get features
	              f_new = []
	              if i['sex'] == 'Male':
	                  sex = 1
	              else:
	                  sex = 0
	              f_new.append(sex)
	
	              birth_year = i['dob'].split("-")[0]
	              current_year = datetime.datetime.now().year
	              age = int(current_year) - int(birth_year)
	              f_new.append(age)
	
	              print "neighbor for"
	              print i['userId']
	
	              x_new = []
	              x_new.append(f_new)
	              neighbor = neigh.predict(x_new)[0]
	
	              # prediction result
	              pred = (i['userId'], neighbor)
	              print pred
	
	              # get recommendation for neightbor, and copy house reco
	              response2 = rectalbe.scan()
	              for j in response2['Items']:
	                  try:
	                      if neighbor == j['username']:
	                          copyresult = j['recommendation']
	                      itempredict = {
	                          'username': i['userId'],
	                          'recommendation': copyresult
	                      }
	                      print "itempredict"
	                      print itempredict
	                      response = rectalbe.put_item(
	                          Item=itempredict
	                      )
	                  except:
	                      continue
	
	              while 'LastEvaluatedKey' in response2:
	                  response2 = rectalbe.scan(
	                      ExclusiveStartKey=response2['LastEvaluatedKey']
	                  )
	                  for j in response2['Items']:
	                      try:
	                          if neighbor == j['username']:
	                              copyresult = j['recommendation']
	                          itempredict = {
	                              'username': i['userId'],
	                              'recommendation': copyresult
	                          }
	                          print "itempredict"
	                          print itempredict
	                          response = rectalbe.put_item(
	                              Item=itempredict
	                          )
	
	                      except:
	                          continue
	
	      except:
	          continue
	
	
	
	
	#
	# for key in result:
	#     print result[key]
	#     for item in result[key]:
	#         print "userid"
	#         print item[0]
	#         print "houseid"
	#         print item[1]
	#         print "score"
	#         print item[2]
	
