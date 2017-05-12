var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var signup = function(event, callback) {
    var id = new Date().getTime().toString().substring(4, 13);
    docClient.put({
        TableName: 'user',
        Item: {
            'username': event.body.username,
            'userId' : id,
            'token': event.body.token,
            'email': event.body.email,
            'isNew': true
        },
        Expected: {
            username: {Exists: false}
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            callback(null, {'status': 'success'});
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
            signup(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};
