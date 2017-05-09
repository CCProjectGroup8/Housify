# encoding=utf8
import boto3
import json
import sys
from decimal import *
from google.cloud import language


def getRes():

    reload(sys)
    sys.setdefaultencoding('utf8')

    context = Context(prec=2, rounding=ROUND_UP)

    # Get service resource
    dynamodb = boto3.resource('dynamodb',
                              aws_access_key_id = '...',
                              aws_secret_access_key = '...',
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

        rates = context.create_decimal_from_float(0.5 * float(rate_site) + 0.5 * float(rate_content))
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

          rates = context.create_decimal_from_float(0.5 * float(rate_site) + 0.5 * float(rate_content))
          # tuple = (i['reviewerId'], i['houseId'], str(rates))
          # result.append(tuple)
          reviewer = i['reviewerId']
          if reviewer not in result:
              result[reviewer] = []
          result[reviewer].append((i['reviewerId'], i['houseId'], str(rates)))

    return result

# for key in result:
#     print result[key]
