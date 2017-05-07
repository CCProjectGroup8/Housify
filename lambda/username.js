var googleMapsClient = require('@google/maps').createClient({
    key: '...'
});

var AWS = require('aws-sdk');
var googleMapsClient = require('@google/maps').createClient({
    key: '...'
});
// aws.config.region = 'us-east-1'; 

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com",
    accessKeyId: '...',
    secretAccessKey: '...'
});

var docClient = new AWS.DynamoDB.DocumentClient();


searchAddress = function searchAddress(address, callback) {
    console.log('Search Address');
    // Geocode an address.
    googleMapsClient.geocode({
        address: address
    }, function(err, response) {
        if (!err) {
            var coord = response.json.results[0].geometry.location;
            console.log("coord = " + coord);
            callback(coord);
            // return {coord:coord,zipcode:zipcode};
        } else {
            console.log("The Geocode was not successful for the following reason: " + status);
            callback(null);
        }

    });
};

var getUser = function(event, callback) {
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
            callback(null, {'results': data});
        }
    });
}

var editUser = function(event, callback) {
	var query = event.body.street  + ' ' + event.body.zip;
	searchAddress(query, function(coord) {
		if (coord !== null) {
			var params = {
		        TableName: "user",
		        Key:{
		            "username": event.body.username
		        },
		        UpdateExpression: "set email =:e, phone =:p, address =:a, preference =:r, sex =:s",
		        ExpressionAttributeValues:{
		            ":e":event.body.email,
		            ":p":event.body.phone,
		            ":a":{
		                "street": event.body.street,
		                "city": event.body.city,
		                "states": event.body.state,
		                "zip": event.body.zip,
		                "coordinate": {
		                    "lat": coord.lat,
		                    "lng": coord.lng
		                }
		            },
		            ":r":event.body.preference,
		            ":s":event.body.sex
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
		else {
			callback(new Error('Address is invalid, please double check'));
		}
	});
}


var deleteUser = function(event, callback) {
    docClient.delete({
        TableName: 'user',
        Key:{
            "username": event.body.username,
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
            getUser(event, done);
            break;
        case 'PUT':
            editUser(event, done);
            break;
        case 'DELETE':
            deleteUser(event, done);
            break;
        default:
            done(new Error('Unsupported method "${event.httpMethod}"'));
            
    }
};

