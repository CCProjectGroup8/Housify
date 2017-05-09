var AWS = require('aws-sdk');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});

var docClient = new AWS.DynamoDB.DocumentClient();
// var db = new aws.DynamoDB();

// var newId = function () {
//   // Math.random should be unique because of its seeding algorithm.
//   // Convert it to base 36 (numbers + letters), and grab the first 9 characters
//   // after the decimal.
//   return Math.random().toString(10).substr(2, 9);
// };

// aws.config.credentials = new aws.CognitoIdentityCredentials({
//     // This will be the identity pool from your federated identity pool and not your user pool id.
//     IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b'
// });


// var signup = function(event, callback) {
//     // console.log("username = " + event.body.username);
//     // console.log("password = " + event.body.password);
//     var userData = {
//         // UserPoolId: 'us-east-1_5Yw8TA9yC',
//         ClientId: '1quiqgcinu0ku9ihi686ga6h7m',
//         Username: event.body.username,
//         Password: event.body.password,
//         UserAttributes: [
//             {
//                 Name: 'email',
//                 Value: event.body.email
//             }    
//         ]
//     };
//     var provider = new aws.CognitoIdentityServiceProvider();
//     provider.signUp(userData, function(err, data) {
//       if (err) {
//           callback(err)
//       } else {
//           callback(null, {"status": "success"});
//       }
//     });
// }


// var model = {
//     // token: {"S": ""},
//     username: {"S": ""},
// //   email: {"S": ""},
// //   phone: {"S": ""},
// //   address: {"S": ""},
// //   zip: {"S": ""},
// //   preference: {"S": ""},
// //   sex: {"S": ""}
// }

var signup = function(event, callback) {
    var id = new Date().getTime();
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