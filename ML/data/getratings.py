# encoding=utf8
import csv
import boto3
import json
import time

import sys
reload(sys)
sys.setdefaultencoding('utf8')

# Get service resource
dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id = 'AKIAJXDMVQWDOX33MAUA',
                          aws_secret_access_key = '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',
                          region_name = 'us-east-1'
                          )
comment_table = dynamodb.Table('commentair')



response = comment_table.scan()
cnt = 0
#writer = csv.writer(open('record.csv', 'w'))

with open('record.csv', 'w') as csvFile:
  fieldnames = ['reviewerId', 'reviewerName', 'timestamp', 'content', 'commentId', 'houseId', 'rating']
  writer = csv.DictWriter(csvFile, fieldnames = fieldnames)

  writer.writeheader()

  response = comment_table.scan()
  for i in response['Items']:
      cnt = cnt + 1
      print(json.dumps(i))

      print cnt
      writer.writerow(i)

  while 'LastEvaluatedKey' in response:
      if cnt > 4000:
          time.sleep(60)
          cnt = 0

      response = comment_table.scan(
      ExclusiveStartKey=response['LastEvaluatedKey']
      )
      for i in response['Items']:
          cnt = cnt +1
          print(json.dumps(i))

          print cnt
          writer.writerow(i)
