var AWS = require('aws-sdk');
var async = require('async');
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: '...',
    secretAccessKey: '...'
});

var docClient = new AWS.DynamoDB.DocumentClient();


var getHouse = function(event, callback) {
    docClient.get({
        TableName: 'house',
        Key:{
            "houseId": event.houseId,
            // "token": event.query.token
        }
    }, function(err, data) {
        if (err) {
            callback(err)
        } else {
            var comments = [];
            var page = event.page;
            async.forEach(data.Item.comment, function(com, callback) {
                docClient.get({
                    TableName: 'comment',
                    Key:{
                        "commentId": com.commentId,
                        // "token": event.query.token
                    }
                }, function(err, data2) {
                    if (err) {
                        callback(err);
                    } else {
                        // console.log(data2.Item);
                        comments.push(data2.Item);
                        callback();
                    }
                });
                // console.log(i);
            }, function (err) {
                if (err) {
                    callback(err);
                } else {
                    
                    if (page){
                        comments = comments.slice(page*10, (page+1)*10);
                    } else {
                        comments = comments.slice(0, 10);
                    }
                    console.log(comments);
                    console.log(page);
                    callback(null, {'house': data, 'comment': comments});
                }
            });
            // console.log(data.Item.comment);
            // for (var i = 0; i < data.Item.comment.length; i++) {
            //     var comment = data.Item.comment[i];
            //     (function(com) {
            //         console.log(com);
            //         docClient.get({
            //             TableName: 'comment',
            //             Key:{
            //                 "commentId": com.commentId,
            //                 // "token": event.query.token
            //             }
            //         }, function(err, data2) {
            //             if (err) {
            //                 callback(err)
            //             } else {
            //                 console.log(data2.Item);
            //                 comments.push(data2.Item);
            //             }
            //         });
            //     }) (comment);
            // }
            // callback(null, {'house': data, 'comment': comments});
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
            getHouse(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};
