
//globals

jwt_token = null; //recived from server, passed back doing payment

// cart_items = [];

items_id = [];

coords = [];

rec_i = [];

var accountDisplayHandler = {
    userName: null,
    loginNavElement: $("#loginNavElement"),
    logoutNavElement: $("#logoutNavElement"),
    signUpNavElement: $("#signUpNavElement"),
    usernameNavElement: $("#usernameNavElement"),
    ordersInfoNavElement: $("#ordersInfoNavElement"),
    houseNavElement: $("#houseNavElement")
};

var handler = StripeCheckout.configure({
  key: 'pk_test_zsMITwkFAOrv7IiPAY2jCm11',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function(token) {
    cleanData = {};
    cleanData['resource'] = "order";
    cleanData['stripeToken'] = token.id;
    cleanData['stripeEmail'] = accountDisplayHandler.userName;
    console.log(cleanData);
    $.ajax({
        type: "POST",
        url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/orderpayment',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function(service_data) {
           // accountDisplayHandler.cartNavElement.hide();
           innerHTML = "";
           $("#houseContent").html(innerHTML);
        },
        error: function (e) {
           alert("Unable to purchase.");
        }
    });

  }
});

accountDisplayHandler.logOut = function () {
    this.userName = null;
    this.usernameNavElement.html("")
    this.usernameNavElement.hide();
    this.logoutNavElement.hide();
    this.signUpNavElement.show();
    this.loginNavElement.show();

    this.ordersInfoNavElement.hide();
    // this.houseNavElement.hide();

    jwt_token = "";
}


accountDisplayHandler.logIn = function (userName) {
    console.log("hit form handler");
    this.userName = userName;
    //this.usernameNavElement.html("<a href='#'>" + userName + "</a>");
    this.usernameNavElement.html("<a href=\"#\" data-toggle=\"modal\" data-target=\"#userInfoModal\">" + userName + "</a>");
    this.usernameNavElement.show();
    this.signUpNavElement.hide();
    this.loginNavElement.hide();
    this.logoutNavElement.show();

    this.ordersInfoNavElement.html("<a href=\"#\" data-toggle=\"modal\" data-target=\"#ordersInfoModal\">" + "Orders" + "</a>");
    this.ordersInfoNavElement.show();
    // this.cartNavElement.html("<a href=\"#\" data-toggle=\"modal\" data-target=\"#cartInfoModal\">" + "Cart" + "</a>");
    // this.cartNavElement.show();
}

function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    //jwt_token = key + "=" + value + ";expires=" + expires.toUTCString();
    jwt_token = value;
    //for single page: jwt_token, for multi page: document.cookie
}

function getCookie(key) {

    return jwt_token;
}

function render_items () {
    var itemLength=0;

    cleanData = {};
    $.ajax({
        type: "GET",
        url: 'https://eu1cndvl5h.execute-api.us-east-1.amazonaws.com/prod',
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function(service_data){
           // console.log(service_data);
           items_data = service_data['message'];
           items_data = items_data['results'];
           // console.log(items_data);
           for(var item in items_data){
                // console.log(item);
                itemLength++;
           }
           // console.log(itemLength);
           innerHTML = "";

           for(var i=0;i<itemLength;i++){
                // console.log("i= " + i + "\n");
                // console.log(items_data[i]['houseId']);
                items_id.push(items_data[i]['houseId']);
                // coords.push(items_data[i]['address']['coordinate']['lat']);
                // coords.push(items_data[i]['address']['coordinate']['lng']);
                
                // map part
                
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(items_data[i]['address']['coordinate']['lat'], items_data[i]['address']['coordinate']['lng']),
                  map: map
                });
                var infowindow = new google.maps.InfoWindow({
                  content: items_data[i]['title']
                });
                marker.addListener('click', function() {
                  map.setZoom(8);
                  map.setCenter(marker.getPosition());
                  infowindow.open(marker.get('map'), marker);
                });

                // end of map part

                if (i%3==0){
                    innerHTML = innerHTML + "<div class=\"row\">";

                }

                innerHTML = innerHTML + "<div class=\"col-sm-6 col-md-4\">";
                innerHTML = innerHTML + "<div class=\"thumbnail\">";
                innerHTML = innerHTML + "<img src=\"";
                // innerHTML = innerHTML + "images/" + items_data[i]['id'] + ".png\" " + "alt=\"" + items_data[i]['item_name'] + "\">";
                innerHTML = innerHTML + "images/" + "placeholder.jpg\" " + "alt=\"" + items_data[i]['houseId'] + "\">";
                innerHTML = innerHTML + "<div class=\"caption\">";
                innerHTML = innerHTML + "<h3>" + items_data[i]['size'] + "</h3>";
                innerHTML = innerHTML + "<p>" + items_data[i]['address']['street'] + "</p>";
                innerHTML = innerHTML + "<p>" + items_data[i]['address']['zip'] + "</p>";

                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"item" + i + "\" value=\"" + i +"\" href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</button>";
                // innerHTML = innerHTML + "<a href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</a>";
                innerHTML = innerHTML + "</div></div></div>";

                if (i%3==2){
                    innerHTML = innerHTML + "<div class=\"row\">";
                }
           }
           if (itemLength%3!=2){
                innerHTML = innerHTML + "<div class=\"row\">";
           }
           $("#container").html(innerHTML);
           for (var i=0;i<itemLength;i++){
                target_string = "#item" + i;
                $( target_string ).click(function() {
                    houseDetail();
                    
                });
            }
        },
        error: function (e) {
           alert("Unable to retrieve your data.");
        }
    });
}

// accountDisplayHandler.userInfo = function() {
//     console.log(jwt_token);

//     cleanData = {};
//     cleanData['resource'] = 'customer';
//     cleanData['type'] = 'CustomerInfo';
//     cleanData['jwt'] = jwt_token;
//     $.ajax({
//         type: "POST",
//         url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/info',
//         crossDomain: true,
//         contentType: 'application/json',
//         data: JSON.stringify(cleanData),
//         dataType: 'json',
//         success: function(service_data){
//            if (service_data['status']=='success'){
//                customer_data = service_data['customer']
//                insertHTML = "";
//                insertHTML = insertHTML + "<table class=\"table table-hover\">";
//                insertHTML = insertHTML + "<tbody>";
//                insertHTML = insertHTML + "<tr>" + "<td>ID</td><td>" + customer_data['id']+ "</td></tr>";
//                insertHTML = insertHTML + "<tr>" + "<td>First Name</td><td>" + customer_data['first_name']+ "</td></tr>";
//                insertHTML = insertHTML + "<tr>" + "<td>Last Name</td><td>" + customer_data['last_name']+ "</td></tr>";
//                insertHTML = insertHTML + "<tr>" + "<td>Date of Birth</td><td>" + customer_data['date_of_birth']+ "</td></tr>";
//                insertHTML = insertHTML + "<tr>" + "<td>Balance</td><td>" + customer_data['balance']+ "</td></tr>";
//                insertHTML = insertHTML + "</tbody>";
//                insertHTML = insertHTML + "</table>";
//                $("#userContent").html(insertHTML);
//            }
//            else{
//                alert("No accessibility.");
//            }
//         },
//         error: function (e) {
//            alert("Unable to retrieve your data.");
//         }
//     });
// }

// accountDisplayHandler.ordersInfo = function() {
//     console.log(jwt_token);

//     cleanData = {};
//     cleanData['resource'] = 'customer';
//     cleanData['type'] = 'CustomerAccount';
//     cleanData['jwt'] = jwt_token;
//     $.ajax({
//         type: "POST",
//         url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/order',
//         crossDomain: true,
//         contentType: 'application/json',
//         data: JSON.stringify(cleanData),
//         dataType: 'json',
//         success: function(service_data){
//            if (service_data['status']=='success'){
//                orders_data = service_data['orders']
//                insertHTML = "";
//                // "<div id=\"carouselControls\" class=\"carousel slide\" data-ride=\"carousel\"><div class=\"carousel-inner\" role=\"listbox\">";
 
//                var jsLength=0;
//                for(var order in orders_data){
                    
//                     jsLength++;
//                }       
//                for(var i=0;i<jsLength;i++){
                    
//                     insertHTML = insertHTML + "<div class=\"card text-center\">";
//                     insertHTML = insertHTML + "<div class=\"card-header\">";
//                     insertHTML = insertHTML + "Order ID: #" + orders_data[i]['id'];
//                     insertHTML = insertHTML + "</div>";
//                     insertHTML = insertHTML + "<div class=\"card-block\">";
//                     insertHTML = insertHTML + "<h4 class=\"card-title\">";
//                     insertHTML = insertHTML + orders_data[i]['item_name'] + "</h4>";
//                     insertHTML = insertHTML + "<p class=\"card-text\">";

//                     insertHTML = insertHTML + "<table class=\"table table-hover\">";
//                     insertHTML = insertHTML + "<thead><tr>" + "<th>Details</th>" + "</tr></thead>";
//                     insertHTML = insertHTML + "<tbody>";
//                     insertHTML = insertHTML + "<tr>" + "<td>Price</td><td>" + orders_data[i]['price']+ "</td></tr>";
//                     insertHTML = insertHTML + "<tr>" + "<td>Address</td><td>" + orders_data[i]['address']+ "</td></tr>";
//                     insertHTML = insertHTML + "<tr>" + "<td>Payment Method</td><td>" + orders_data[i]['payment_method']+ "</td></tr>";
//                     insertHTML = insertHTML + "<tr>" + "<td>Time</td><td>" + orders_data[i]['time']+ "</td></tr>";
//                     insertHTML = insertHTML + "</tbody>";
//                     insertHTML = insertHTML + "</table>";

//                     insertHTML = insertHTML + "</p>";
//                     // insertHTML = insertHTML + "<a href=\"#\" class=\"btn btn-primary\">Go somewhere</a>";
//                     insertHTML = insertHTML + "</div>" + "<div class=\"card-footer text-muted\">";
//                     // insertHTML = insertHTML + orders_data[i]['time'] + "</div></div>";
//                     insertHTML = insertHTML + "</div></div>";
//                }
//                // alert(insertHTML);
//                $("#ordersContent").html(insertHTML);
//            }
//            else{
//                insertHTML = "";
//                $("#ordersContent").html(insertHTML);
//            }
//         },
//         error: function (e) {
//            alert("Unable to retrieve your data.");
//         }
//     });
// }

// accountDisplayHandler.houseInfo = function(service_data) {
     
// }

// accountDisplayHandler.emptyCart = function () {
//     console.log(cart_items);
//     var cartLength=0;
//     for(var item in cart_items){
//         cartLength++;
//     }

//     cleanData = {};
//     cleanData['resource'] = "shoppingcart";
//     cleanData['type'] = "DeleteCart";
//     cleanData['jwt'] = jwt_token;
//     for (var i=0;i<cartLength;i++){
//         cleanData['item_id'] = cart_items[i];
//         $.ajax({
//             type: "POST",
//             url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/shoppingcart',
//             crossDomain: true,
//             contentType: 'application/json',
//             data: JSON.stringify(cleanData),
//             dataType: 'json',
//             success: function(service_data) {
//                 if (service_data['status']=='success'){
//                     //
//                 }
//                 else{
//                     alert("No accessibility.");
//                 }
//             },
//             error: function (e) {
//                 alert("Unable to retrieve your data.");
//             }
//         });
//     }
//     cart_items = [];
//     innerHTML = "";
//     $("#cartContent").html(innerHTML);
// }

// function login(formData) {
//     cleanData = {};
//     cleanData['resource'] = "customer";
//     cleanData['type'] = "LogIn";
//     cleanData['customer'] = {
//         'id':       formData['email'],
//         'password': formData['password']
//     }
//     // console.log(cleanData);
//
//     $.ajax({
//         type: "POST",
//         url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/login',
//         crossDomain: true,
//         contentType: 'application/json',
//         // header:{
//         //     'Access-Control-Allow-Origin': "*"
//         // },
//         data: JSON.stringify(cleanData),
//         dataType: 'json',
//         success: function(service_data){
//            if (service_data['status']=='success'){
//                accountDisplayHandler.logIn(formData.email);
//                $('#loginModal').modal('hide')
//                //set jwt_token
//                setCookie("jwt_token", service_data['jwt']);
//            }
//            else{
//                alert("Invalid email or password.");
//                accountDisplayHandler.logOut();
//            }
//         },
//         error: function (e) {
//            alert("error");
//            accountDisplayHandler.logOut();
//         }
//     });
// }

// function signUp(formData) { //new acccount
//     cleanData = {};
//     cleanData['resource'] = "customer";
//     cleanData['type'] = "SignUp";
//     cleanData['customer'] = {
//         'id':           formData['email'],
//         'first_name':   formData['first_name'],
//         'last_name':    formData['last_name'],
//         'password':     formData['password'],
//         'date_of_birth': formData['date_of_birth']
//     }
    
//     $.ajax({
//          type: "POST",
//          url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/signup',
//          crossDomain: true,
//          contentType: 'application/json',
         
//          data: JSON.stringify(cleanData),
//          dataType: 'json',
//          success: function(data) {
//              //TODO
//              // accountDisplayHandler.logIn(formData.email);
//              $('#signUpModal').modal('hide')
//              alert("Please confirm your email.");
//          },
//          failure: function (data) {
//              alert(data.errorMessage)
//          }
//      });
// }

function submitForm(formData) {
    // TODO

}

function houseDetail() {
    // alert("add item!");
    // alert("houseDetail");
    // if (jwt_token==""){
    //     alert("Please sign in first.");
    //     return;
    // }
    cleanData = {};
    // console.log(cleanData);
    caller_id = items_id[parseInt(event.target.value)];
    $.ajax({
        type: "GET",
        url: 'https://eu1cndvl5h.execute-api.us-east-1.amazonaws.com/prod/house/' + caller_id,
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function(service_data) {
           items_data = service_data['message']['results'];
           items_data = items_data['Item'];
           innerHTML = "";
             console.log(items_data);
             
             innerHTML = "";
             innerHTML = innerHTML + "<table class=\"table\">";
             innerHTML = innerHTML + "<thead><tr>";
             // innerHTML = innerHTML + "<th>#</th>";
             innerHTML = innerHTML + "<th>Name</th>";
             // innerHTML = innerHTML + "<th>ID</th>";
             innerHTML = innerHTML + "<th>Size</th>";
             innerHTML = innerHTML + "<th>Street</th>";
             innerHTML = innerHTML + "<th>Zip</th>";
             innerHTML = innerHTML + "</tr></thead>";
             // var jsLength=0;
             // cart_items = [];
             // for(var item in items_data){
             //      jsLength++;
             // }
             innerHTML = innerHTML + "<tbody>";
             // for(var i=0;i<jsLength;i++){
                  // cart_items.push(items_data[i]['id']);

              innerHTML = innerHTML + "<tr>";
              // innerHTML = innerHTML + "<th scope=\"row\">" + "</th>";
              innerHTML = innerHTML + "<td>" + items_data['title'] + "</td>";
              // innerHTML = innerHTML + "<td>" + items_data[i]['houseId'] + "</td>";
              innerHTML = innerHTML + "<td>" + items_data['size'] + "</td>";
              innerHTML = innerHTML + "<td>" + items_data['address']['street'] + "</td>";
              innerHTML = innerHTML + "<td>" + items_data['address']['zip'] + "</td>";
              innerHTML = innerHTML + "</tr>";
             // }

             /* comment part */

             innerHTML = innerHTML + "<table class=\"table\">";
             innerHTML = innerHTML + "<thead><tr>";
             // innerHTML = innerHTML + "<th>#</th>";
             innerHTML = innerHTML + "<th>Username</th>";
             // innerHTML = innerHTML + "<th>ID</th>";
             innerHTML = innerHTML + "<th>Time</th>";
             innerHTML = innerHTML + "<th>Comment</th>";
             // innerHTML = innerHTML + "<th>Zip</th>";
             innerHTML = innerHTML + "</tr></thead>";
             innerHTML = innerHTML + "<tbody>";
             innerHTML = innerHTML + "<tr>";
             innerHTML = innerHTML + "<td>" + items_data['title'] + "</td>";
             // innerHTML = innerHTML + "<td>" + items_data[i]['houseId'] + "</td>";
             innerHTML = innerHTML + "<td>" + items_data['size'] + "</td>";
             innerHTML = innerHTML + "<td>" + items_data['address']['street'] + "</td>";
             // innerHTML = innerHTML + "<td>" + items_data['address']['zip'] + "</td>";
             innerHTML = innerHTML + "</tr>";

             innerHTML = innerHTML + "</tbody></table>";

             /* end of comment part */

             /* submit comment part */

             innerHTML = innerHTML + "<form id=\"commentForm\">";
             innerHTML = innerHTML + "<div class=\"form-group\">";
             innerHTML = innerHTML + "<label for=\"commentContent\">Comment Content</label>";
             innerHTML = innerHTML + "<input type=\"comment\" class=\"form-control\" id=\"commentContent\" placeholder=\"Comment Content\" name=\"commentContent\">";
             innerHTML = innerHTML + "</div>";
             innerHTML = innerHTML + "<button type=\"submit\" class=\"btn btn-default\">Submit Comment</button></form>";

             /* end of submit comment part */

             $("#houseContent").html(innerHTML);
        },
        error: function (e) {
           alert("Unable to view details.");
        }
    });
}

function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      center: {lat: -33.865427, lng: 151.196123},
      mapTypeId: 'terrain'
    });
    // console.log(coords);
    // console.log(coords.length);
}

function ResponseHandler(e, item_id) {
    e.preventDefault();
    console.log("response function");
    $.ajax({
      url: $('#item'+item_id).attr('action'),
      type: "POST",
      data : $('#item'+item_id).serialize(),
      success: function(response){
        console.log('form submitted.');
        console.log(response);
      }
    });

    // var ccNum = $('.data-key').val(),
    //     cvcNum = $('.card-cvc').val(),
    //     expMonth = $('.card-expiry-month').val(),
    //     expYear = $('.card-expiry-year').val();

    // cleanData = {}
    // cleanData['operation'] = "create";
    // cleanData['item_id'] = item_id;
    // // cleanData['item_name'] = data-name;
    // // cleanData['price'] = data-amount;
    // if (item_id=="1"){
    //     cleanData['item_name'] = "Responsive Web Design with HTML5 and CSS3";
    //     cleanData['item_amount'] = "1999";
    // }
    // cleanData['card_number'] = ccNum;
    // cleanData['cvc'] = cvcNum;
    // cleanData['exp_month'] = expMonth;
    // cleanData['exp_year'] = expYear;
    // cleanData['jwt'] = jwt_token;
    // alert(cleanData);
    // $.ajax({
    //     type: "POST",
    //     url: 'https://aztwsjvkm5.execute-api.us-west-2.amazonaws.com/prod/customer/login',
    //     crossDomain: true,
    //     contentType: 'application/json',
    //     data: JSON.stringify(cleanData),
    //     dataType: 'json',
    // });
}

$(document).ready(function() {
    render_items();

    accountDisplayHandler.logOut();

    // $('#loginForm').submit(function (e) {
    //     e.preventDefault();
    //     login($(this).serializeArray().reduce(
    //         function(accumulater, curr) {
    //             accumulater[curr.name] = curr.value;
    //             return accumulater;
    //         }, {}));
    // });
    // $('#signUpForm').submit(function (e) {
    //     e.preventDefault();
    //     var formData = $(this).serializeArray().reduce(
    //         function(accumulater, curr) {
    //             accumulater[curr.name] = curr.value;
    //             return accumulater;
    //         }
    //         , {});
    //     if(formData["password"] !== formData["passwordCheck"]) {
    //         alert("Both password entries must match.");
    //         return;
    //     } else if (formData["password"].length < 6) {
    //         alert("Passwords must be at least 6 character in length.");
    //         return;
    //     }
    //     signUp(formData);
    // });

    /* new comment function */
    $('commentForm').submit(function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray().reduce(
            function(accumulater, curr) {
                accumulater[curr.name] = curr.value;
                return accumulater;
            }
            , {});
        submitForm(formData);
    });
    
    $( "#usernameNavElement" ).click(function() {
        accountDisplayHandler.userInfo();
    });
    $( "#ordersInfoNavElement" ).click(function() {
        accountDisplayHandler.ordersInfo();
    });
    // $( "#houseNavElement" ).click(function() {
    //     accountDisplayHandler.houseInfo();
    // });

    // $( "#logoutNavElement" ).click(function() {
    //     accountDisplayHandler.logOut();
    // });

    $( "#emptyCart" ).click(function() {
        accountDisplayHandler.emptyCart();
    });
    $( "#paymentButton" ).click(function(e) {
        handler.open({
            name: 'Cart',
            description: 'Payment for books',
            amount: 2000
        });
        e.preventDefault();
    });
    $( "#datetimepicker" ).datetimepicker({
        pickTime: false
    });
});
