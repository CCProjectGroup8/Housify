# encoding=utf8
import boto3
import json
import sys
from decimal import *
from google.cloud import language


reload(sys)
sys.setdefaultencoding('utf8')

context = Context(prec=2, rounding=ROUND_UP)

# Get service resource
dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id = '',
                          aws_secret_access_key = '',
                          region_name = 'us-east-1'
                          )
tablecomment = dynamodb.Table('comments')


# google sentiment analysis here
language_client = language.Client()
print "here"

# return user result
result = []

response = tablecomment.scan()
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

    rates = context.create_decimal_from_float(0.5 * float(rate_site) + 0.5 * float(rate_content))
    tuple = (i['reviewerId'], i['houseId'], rates)
    result.append(tuple)


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

      rates = context.create_decimal_from_float(0.5 * float(rate_site) + 0.5 * float(rate_content))
      tuple = (i['reviewerId'], i['houseId'], rates)
      result.append(tuple)

print result

