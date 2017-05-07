var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: '...',
    secretAccessKey: '...'
});

var docClient = new AWS.DynamoDB.DocumentClient();

var newId = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};

var log = function(event, callback) {
    var id = newId();
    var date = new Date().valueOf();
    docClient.put({
        TableName: 'log',
        Item: {
            'logId': id,
            'username': event.body.username,
            'housId': event.body.houseId,
            'timestamp': date
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
            log(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};
