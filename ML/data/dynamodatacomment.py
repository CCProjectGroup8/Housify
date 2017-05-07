from pyzillow.pyzillow import ZillowWrapper, GetDeepSearchResults, GetUpdatedPropertyDetails
import csv
import boto3
from decimal import *


getcontext().prec = 5
context = Context(prec=5, rounding=ROUND_UP)
context2 = Context(prec=2, rounding=ROUND_UP)

# Get service resource
dynamodb = boto3.resource('dynamodb',
                          aws_access_key_id = '',
                          aws_secret_access_key = '',
                          region_name = 'us-east-1'
                          )




tablecomment = dynamodb.create_table(
    TableName='commentairbnb',
    KeySchema=[
        {
            'AttributeName': 'commentId',
            'KeyType': 'HASH'
        },
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'commentId',
            'AttributeType': 'S'
        },

    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 500,
        'WriteCapacityUnits': 1500
    }
)


# tablehouse.meta.client.get_waiter('table_exists').wait(TableName='houseair')
tablecomment.meta.client.get_waiter('table_exists').wait(TableName='commentairbnb')


# comment_table = dynamodb.Table('commentair')
#
# with open('reviews.csv') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for row in reader:
#         try:
#             comment = {
#                 'commentId': row['id'],
#                 'houseId': row['listing_id'],
#                 'content': row['comments'],
#                 'timestamp': row['date'],
#                 'reviewerId': row['reviewer_id'],
#                 'reviewerName': row['reviewer_name']
#             }
#             print "put comment"
#             response = comment_table.put_item(
#                 Item=comment
#             )
#         except:
#             continue
#
#
#
#
#
