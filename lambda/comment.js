var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

// var newId = function () {
//   // Math.random should be unique because of its seeding algorithm.
//   // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//   // after the decimal.
//   return Math.random().toString(10).substr(2, 9);
// };

var postComment = function(event, callback) {
    var params = {
        TableName: "user",
        Key:{
            "username": event.body.username
        },
        UpdateExpression: "set isNew =:n",
        ExpressionAttributeValues:{
            ":n":false
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            
        }
    });
    var date = new Date().valueOf();
    var id = "0" + new Date().getTime().toString().substring(4, 13);
    docClient.get({
        TableName: 'user',
        Key:{
            "username": event.body.username,
            // "token": event.query.token
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            console.log(data);
            var userId = data.Item.userId;
            var rating = parseInt(event.body.rating);
            console.log(userId);
            docClient.put({
                TableName: 'comments',
                Item: {
                    'commentId': id,
                    'houseId': event.body.houseId,
                    'content': event.body.content,
                    'timestamp': date,
                    'reviewerName': event.body.username,
                    'reviewerId': userId,
                    'rating': rating
                }
            }, function(err, data) {
                if (err) {
                    callback(err)
                } else {
                    docClient.update({
                        TableName: 'houseairbnb',
                        Key:{
                            "houseId": event.body.houseId,
                        },
                        ReturnValues: 'ALL_NEW',
                        UpdateExpression: 'set #comment = list_append(if_not_exists(#comment, :empty_list), :com)',
                        ExpressionAttributeNames: {
                          '#comment': 'comment'
                        },
                        ExpressionAttributeValues: {
                          ':com': [{"commentId": id, "ourUser": true}],
                          ':empty_list': []
                        }
                    }, function(err, data2) {
                        if (err) {
                            callback(err)
                        } else {
                            callback(null, {'status': 'success'});
                        }
                    });
                }
            });
        }
    });
}

var getComments = function(event, callback) {
    var results = [];
    docClient.scan({
        TableName: 'comment'
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            for (var i = 0; i < data.Items.length; i++)
            {
                results.push(data.Items[i]);
            }
            callback(null, {'results': results});
        }
    });
}

exports.handler = (event, context, callback) => {
    // We'll modify our response code a little bit so that when the response
    // is ok, we'll return the list of emails in the message
    const done = (err, res) => {
        if (err) {
            callback(null, {
                statusCode: 400,
                message: err.message
            });
        } else {
            callback(null, {
                statusCode: 200,
                message: res
            });
        }
    }
    
    switch (event.httpMethod) {
        case 'POST':
            postComment(event, done);
            break;
        case 'GET':
            getComments(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};
