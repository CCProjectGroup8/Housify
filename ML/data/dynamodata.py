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


tablehouse = dynamodb.create_table(
    TableName='houseairbnb',
    KeySchema=[
        {
            'AttributeName': 'houseId',
            'KeyType': 'HASH'
        },
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'houseId',
            'AttributeType': 'S'
        },

    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 500,
        'WriteCapacityUnits': 1500
    }
)

# tablecomment = dynamodb.create_table(
#     TableName='commentairbnb',
#     KeySchema=[
#         {
#             'AttributeName': 'commentId',
#             'KeyType': 'HASH'
#         },
#     ],
#     AttributeDefinitions=[
#         {
#             'AttributeName': 'commentId',
#             'AttributeType': 'S'
#         },
#
#     ],
#     ProvisionedThroughput={
#         'ReadCapacityUnits': 500,
#         'WriteCapacityUnits': 1500
#     }
# )


tablehouse.meta.client.get_waiter('table_exists').wait(TableName='houseairbnb')
# tablecomment.meta.client.get_waiter('table_exists').wait(TableName='commentairbnb')


house_table = dynamodb.Table('houseairbnb')
# comment_table = dynamodb.Table('commentairbnb')

review_houseid = []
review_revid = []


with open('reviews.csv') as csvfile2:
    reader = csv.DictReader(csvfile2)
    for row in reader:
        review_houseid.append(row['listing_id'])
        review_revid.append(row['id'])


with open('listings.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        try:
            house = {
                'houseId': row['id'],
                'title': row['name'],
                'summary': row['summary'],
                'picture_url': row['picture_url'],
                'property_type': row['property_type'],
                'room_type': row['room_type'],
                'size': row['accommodates'],
                'bathrooms': row['bathrooms'],
                'bedrooms': row['bedrooms'],
                'amenities': row['amenities'],
                'cancellation_policy': row['cancellation_policy'],
                'address': {
                    'street': row['street'],
                    'district': row['city'],
                    'city': 'New York',
                    'zip' : row['zipcode'],
                    'coordinate': {
                        'lat': row['latitude'],
                        'lng': row['longitude']
                    }
                },
                'rating': row['review_scores_rating'],
                'price': row['price']
            }
            house['comment'] = []
            for i, j in zip(review_houseid, review_revid):
                if  i == row['id']:
                    house['comment'].append({'commentId' : j})

            print "put house"
            response = house_table.put_item(
                Item=house
            )
        except:
            continue

# with open('reviews.csv') as csvfile:
#     reader = csv.DictReader(csvfile)
#     for houseid in houses_record:
#         for row in reader:
#             try:
#                 if houseid == row['id']:
#                     comment = {
#                         'commentId': row['id'],
#                         'houseId': row['listing_id'],
#                         'content': row['comments'],
#                         'timestamp': row['date'],
#                         'reviewerId': row['reviewer_id'],
#                         'reviewerName': row['reviewer_name']
#                     }
#                     print "put comment"
#                     response = comment_table.put_item(
#                         Item=comment
#                     )
#             except:
#                 continue





