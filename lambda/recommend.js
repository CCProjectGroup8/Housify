var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();

var getRecommend = function(event, callback) {
    docClient.get({
        TableName: 'user',
        Key:{
            "username": event.username,
            // "token": event.query.token
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            docClient.get({
                TableName: 'recommendresult',
                Key:{
                    "username": data.Item.userId,
                    // "token": event.query.token
                }
            }, function(err, data2) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, {'recommend': data2.Item.recommendation});
                }
            });
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
        case 'GET':
            getRecommend(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};