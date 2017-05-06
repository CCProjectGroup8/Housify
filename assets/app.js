AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // This will be the identity pool from your federated identity pool and not your user pool id.
    IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b',
    Logins: {
      'cognito-idp.us-east-1.amazonaws.com/us-east-1_5Yw8TA9yC': JSON.parse(localStorage.getItem('token'))
    }
});

// IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b'
// UserPoolId: 'us-east-1_5Yw8TA9yC'
// ClientId: '1quiqgcinu0ku9ihi686ga6h7m'

//
// AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b',
//     Logins: {
//       'cognito-idp.us-east-1.amazonaws.com/us-east-1_5Yw8TA9yC': JSON.parse(localStorage.getItem('token'))
//     }
// });

$(document).ready(function(){
  updateAuthenticationStatus();
  // loadAdmin();
});

function logout(){
  localStorage.clear();
  window.location.reload();
};

function updateAuthenticationStatus(){
  $('#usernameNavElement').empty();
  $('#loginNavElement').empty();
  $('#loginModal').find('#loginError').empty();
  var user = localStorage.getItem('token');
  // console.log(user);
  if(user){
    $('#logoutNavElement').show();
    $('#loginNavElement').hide();
    $('#signUpNavElement').hide();
  } else {
    $('#loginNavElement').show().append('<a href="#" data-toggle="modal" data-target="#loginModal">Login</a>');
    $('#usernameNavElement').hide();
  }
}

// function loadAdmin(){
//   if(window.location.pathname == '/admin/'){
//     if(localStorage.getItem('token')){
//       AWS.config.credentials.get(function (err) {
//         var client = apigClientFactory.newClient({
//           accessKey: AWS.config.credentials.accessKeyId, 
//           secretKey: AWS.config.credentials.secretAccessKey, 
//           sessionToken: AWS.config.credentials.sessionToken,
//           region: 'us-east-1'  
//         });
//         client.subscribersGet().then(function(data){
//           for(var i = 0; i < data.data.message.length; i++){
//             $('#subscribers').append('<h4>' + data.data.message[i].email + '</h4>');
//           }
//         });
//       });
//     } else {
//       window.location = '/';
//     }
//   }
// }


// Sign up action
$('#signUpForm').submit(function(e){
    e.preventDefault();
    AWSCognito.config.region = 'us-east-1';
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b'
    });
    // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

    var poolData = {
        UserPoolId : 'us-east-1_5Yw8TA9yC', // Your user pool id here
        ClientId : '1quiqgcinu0ku9ihi686ga6h7m' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : $('#signUpEmail').val()
    };

    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    var username = $('#signUpUsername').val();
    var password = $('#signUpPassword').val();

    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            alert("sign up failed: " + err);
            console.log(err);
            return;
        }
        alert("sign up successful!");

        // console.log('user name is ' + JSON.stringify(result));
        login(username, password);
    });
})


// login action
$('#loginForm').submit(function(e){
    e.preventDefault();

    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    login(username,password);


})

// login function
function login(username, password) {
    AWSCognito.config.region = 'us-east-1';
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:9e5b0f52-67a2-48dd-a112-815bc5037a3b'
    });
    // // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
    AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

    var authenticationData = {
        Username : username,
        Password : password,
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId : 'us-east-1_5Yw8TA9yC', // Your user pool id here
        ClientId : '1quiqgcinu0ku9ihi686ga6h7m' // Your client id here
    };
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : username,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            localStorage.setItem('token', JSON.stringify(result.idToken.jwtToken));
            updateAuthenticationStatus();
            window.location.reload();
        },

        onFailure: function(err) {
            console.log("login failed");
            console.log(err);
            insertHTML = '<span style="color:red;" id="loginError">';
            insertHTML = insertHTML + err.toString().split(':')[1];
            insertHTML = insertHTML + '</span>';
            $("div#loginModal div.modal-header").append(insertHTML);
        },

    });
}