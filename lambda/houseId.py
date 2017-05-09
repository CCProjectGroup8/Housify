import boto3
import json
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb', region_name = 'us-east-1')
house = dynamodb.Table('houseairbnb')
comment = dynamodb.Table('commentair')
comment_our = dynamodb.Table('comments')


def getHouse(event, context):
    try:
        response = house.get_item(
            Key={
                'houseId': event['houseId']
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        item = response['Item']
        
        print item['comment']
            
        comments = []
        # print("GetItem succeeded:")
        # print item
        page = event['page']
        # for com in item['comment']:
        for i in range(page * 10, (page + 1) * 10):
            if i >= len(item['comment']):
                break
            
            com = item['comment'][i]
            
            if 'ourUser' in com:
                db = comment_our
            else:
                db = comment
            # print com['commentId']
            try:
                response2 = db.get_item(
                    Key={
                        'commentId': com['commentId']
                    }
                )
            except ClientError as e:
                print(e.response['Error']['Message'])
            else:
                # print response2
                
                if 'Item' not in response2:
                    return {'status': "fail", 'content': "cannot find comments for this houseId"}
                item2 = response2['Item']
                
                # print("GetItem succeeded:")
                # print item2
                comments.append(item2)

        return {'house': item, 'comment': comments}
        
        # print(json.dumps(item, indent=4, cls=DecimalEncoder))
    
        


def lambda_handler(event, context):
    if (event['httpMethod'] == 'GET'):
        return getHouse(event, context)