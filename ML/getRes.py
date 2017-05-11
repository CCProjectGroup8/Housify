# encoding=utf8
import boto3
import json
import sys
from decimal import *
from google.cloud import language
import config as key
import log

def getRes():

    reload(sys)
    sys.setdefaultencoding('utf8')

    context = Context(prec=2, rounding=ROUND_UP)

    # get log info for rating
    loginfo = log.count_log() 

    # Get service resource
    dynamodb = boto3.resource('dynamodb',
                              aws_access_key_id = key.aws['accessKeyId'],
                              aws_secret_access_key = key.aws['secretAccessKey'],
                              region_name = 'us-east-1'
                              )
    tablecomment = dynamodb.Table('comments')


    # google sentiment analysis here
    language_client = language.Client()

    # return user result
    result = {}

    response = tablecomment.scan()
    for i in response['Items']:
        try:
            # get user's rating in our own website
            rate_site = str(context.create_decimal_from_float((float(i['rating']) - 3) / 2))
            # sentiment rating for comment content
            content = i['content']
            document = language_client.document_from_text(content)
            sentiment = document.analyze_sentiment().sentiment
            rate_content = sentiment.score
        except:
            continue

	if i['reviewerId'] in loginfo:
		if i['houseId'] in loginfo[i['reviewerId']]:
			logcnt = loginfo[i['reviewerId']][i['houseId']]
		else:
			logcnt = 0
	else:
		logcnt = 0
        rates = context.create_decimal_from_float(0.4 * float(rate_content))
        # rates = context.create_decimal_from_float(0.4 / 15 * float(rate_site) + 0.4 * float(rate_content) + 0.2 / 100 * float(logcnt))

        # tuple = (i['reviewerId'], i['houseId'], str(rates))
        # result.append(tuple)
        reviewer =  i['reviewerId']
        if reviewer not in result:
            result[reviewer] = []
        result[reviewer].append((i['reviewerId'], i['houseId'], str(rates)))


    while 'LastEvaluatedKey' in response:
      response = tablecomment.scan(
      ExclusiveStartKey=response['LastEvaluatedKey']
      )
      for i in response['Items']:
          try:
              rate_site = str(context.create_decimal_from_float((float(i['rating']) - 3) / 2))

              content = i['content']
              document = language_client.document_from_text(content)
              sentiment = document.analyze_sentiment().sentiment
              rate_content = sentiment.score
              # print "score"
              # print rate_content
          except:
              continue
	  if i['reviewerId'] in loginfo:
		if i['houseId'] in loginfo[i['reviewerId']]:
			logcnt = loginfo[i['reviewerId']][i['houseId']]
		else:
			logcnt = 0
	  else:
	  	logcnt = 0
          rates = context.create_decimal_from_float(float(rate_content))
          # rates = context.create_decimal_from_float(0.4 / 15 * float(rate_site) + 0.4 * float(rate_content) + 0.2 / 100 * float(logcnt))

          # tuple = (i['reviewerId'], i['houseId'], str(rates))
          # result.append(tuple)
          reviewer = i['reviewerId']
          if reviewer not in result:
              result[reviewer] = []
          result[reviewer].append((i['reviewerId'], i['houseId'], str(rates)))

    return result

# for key in result:
#     print result[key]
