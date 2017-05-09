import boto3
import json
import decimal
import time
import traceback
from google.cloud import language
from watson_developer_cloud import NaturalLanguageUnderstandingV1
import watson_developer_cloud.natural_language_understanding.features.v1 as \
    features
import config as key


dynamodb = boto3.resource('dynamodb', 
                          aws_access_key_id = key.aws['accessKeyId'], 
                          aws_secret_access_key = key.aws['secretAccessKey'],
                          region_name = 'us-east-1')

#nlu = NaturalLanguageUnderstandingV1(version='2017-02-27',
                                #     username="...",
                                #     password="...")
language_client = language.Client()

comment = dynamodb.Table('commentair')

i = 0;

response = comment.scan()
#for item in response['Items']:
#        try:
#               content = item['content']
#       
#               document = language_client.document_from_text(content)
#               print content
#               print document
#       
#               sentiment = document.analyze_sentiment().sentiment
#               rating = sentiment.score
#       
#               comment.update_item(
#                   Key={
#                     'commentId': item['commentId']
#                   },
#                   UpdateExpression="set rating = :r",
#                   ExpressionAttributeValues={
#                       ':r': str(rating),
#                   },
#                   ReturnValues="UPDATED_NEW"
#               )
#               i = i + 1
#               if i % 1000 == 0:
#                       time.sleep(100)
#        except:
#                print "exception"
#               traceback.print_exc()
#               time.sleep(1)
#                continue
j = 0
while 'LastEvaluatedKey' in response:
        response = comment.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
        j = j + 1
        if j < 25:
                print 'skip'
                time.sleep(1)
                continue
        for item in response['Items']:
                try:
                        content = item['content']
                        document = language_client.document_from_text(content)
                        print content
                        print document
                        print i
                        sentiment = document.analyze_sentiment().sentiment
                        rating = sentiment.score
                        comment.update_item(
                            Key={
                                'commentId': item['commentId']
                            },
                            UpdateExpression="set rating = :r",
                            ExpressionAttributeValues={
                                ':r': str(rating),
                            },
                            ReturnValues="UPDATED_NEW"
                        )
                        i = i + 1
                        if i % 1000 == 0:
                                time.sleep(100)
                except:
                        print "exception"
                        traceback.print_exc()
                        time.sleep(1)
                        continue
 
