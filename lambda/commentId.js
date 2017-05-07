var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: '...',
    secretAccessKey: '...'
});

var docClient = new AWS.DynamoDB.DocumentClient();

var getComment = function(event, callback) {
    docClient.get({
        TableName: 'commentair',
        Key:{
            "commentId": event.commentId,
            // "token": event.query.token
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, {'results': data});
        }
    });
}

var editComment = function(event, callback) {
    var params = {
        TableName: "comment",
        Key:{
            "commentId": event.body.commentId
        },
        UpdateExpression: "set content =:c",
        ExpressionAttributeValues:{
            ":c":event.body.content
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, {'msg': "succ"});
        }
    });
}

var deleteComment = function(event, callback) {
    docClient.delete({
        TableName: 'comment',
        Key:{
            "commentId": event.body.commentId,
            // "token": event.query.token
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, {'msg': "succ"});
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
            getComment(event, done);
            break;
        case 'PUT':
            editComment(event, done);
            break;
        case 'DELETE':
            deleteComment(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};
