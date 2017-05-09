var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();

var homepage = function(event, callback) {
    var results = [];
    
    var page = parseInt(event.page);
    // console.log("=-=-==-=-=-=-=-=-=-=-=-=- page: "+page);
    docClient.scan({
        TableName: 'houseairbnb'
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            for (var i = 0; i < data.Items.length; i++)
            {
                if (i >= page * 10 && i < (page + 1) * 10)
                {
                    // console.log("i >= page * 10 && i < (page + 1) * 10 = " + (i >= page * 10 && i < (page + 1) * 10));
                    // console.log("page+1 * 10 = "+ ((page + 1) * 10));
                    // console.log("i = " + i);
                    // console.log("data.Items[i] = "+data.Items[i]);
                    results.push(data.Items[i]);
                }
            }
            // console.log("result size = " + results.length);
            // console.log("data.Item.length = " + data.Items.length);
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
        case 'GET':
            homepage(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};