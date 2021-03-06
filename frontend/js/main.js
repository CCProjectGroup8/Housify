//globals

jwt_token = null; //recived from server, passed back doing payment

// cart_items = [];

items_id = [];

coords = [];

rec_i = [];

now_item_page = 0;

itemLength = 0;

now_page = [];

is_recommendation = 0;

var accountDisplayHandler = {
    userName: null,
    loginNavElement: $("#loginNavElement"),
    logoutNavElement: $("#logoutNavElement"),
    signUpNavElement: $("#signUpNavElement"),
    usernameNavElement: $("#usernameNavElement"),
    ordersInfoNavElement: $("#ordersInfoNavElement"),
    houseNavElement: $("#houseNavElement")
};
//
// var handler = StripeCheckout.configure({
//     key: 'pk_test_zsMITwkFAOrv7IiPAY2jCm11',
//     image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
//     locale: 'auto',
//     token: function (token) {
//         cleanData = {};
//         cleanData['resource'] = "order";
//         cleanData['stripeToken'] = token.id;
//         cleanData['stripeEmail'] = accountDisplayHandler.userName;
//         console.log(cleanData);
//         $.ajax({
//             type: "POST",
//             url: 'https://dh0y47otf3.execute-api.us-west-2.amazonaws.com/prod/customer/orderpayment',
//             crossDomain: true,
//             contentType: 'application/json',
//             data: JSON.stringify(cleanData),
//             dataType: 'json',
//             success: function (service_data) {
//                 // accountDisplayHandler.cartNavElement.hide();
//                 innerHTML = "";
//                 $("#houseContent").html(innerHTML);
//             },
//             error: function (e) {
//                 alert("Unable to purchase.");
//             }
//         });
//
//     }
// });

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

function render_items() {
    document.getElementById('brandName').innerHTML = "Housify | all houses";

    itemLength = 0;

    cleanData = {};
    now_page = [];
    items_id = [];

    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod?page=' + now_item_page,
        crossDomain: true,
        contentType: 'application/json',
        dataType: 'json',
        success: function (service_data) {
            items_data = service_data['message'];
            console.log('one');
            console.log(items_data);
            items_data = items_data['results'];
            itemLength= items_data.length;
            innerHTML = "";
            console.log(items_data.length);
            for (var i = 0; i < items_data.length; i++) {
                console.log("item_render"+items_data[i]);
                items_id.push(items_data[i]);
                now_page.push(0);
                // coords.push(items_data[i]['address']['coordinate']['lat']);
                // coords.push(items_data[i]['address']['coordinate']['lng']);

                // map part

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(items_data[i]['address']['coordinate']['lat'], items_data[i]['address']['coordinate']['lng']),
                    map: map
                });

                enableMarker(marker, items_data[i]['title']);
                // var infowindow = new google.maps.InfoWindow({
                //     content: items_data[i]['title']
                // });
                // marker.addListener('click', function () {
                //     map.setZoom(13);
                //     map.setCenter(marker.getPosition());
                //     console.log(marker.position.lat(), marker.position.lng());
                //     infowindow.open(marker.get('map'), marker);
                // });

                // end of map part

                if (i % 2 == 0) {
                    innerHTML = innerHTML + "<div class=\"row\">";

                }

                innerHTML = innerHTML + "<div class=\"col-sm-6 col-md-4\">";
                innerHTML = innerHTML + "<div class=\"thumbnail\">";

                innerHTML = innerHTML + "<img src=\"";
                // // innerHTML = innerHTML + "images/" + items_data[i]['id'] + ".png\" " + "alt=\"" + items_data[i]['item_name'] + "\">";
                // innerHTML = innerHTML + "images/" + "placeholder.jpg\" " + "alt=\"" + items_data[i]['houseId'] + "\">";
                // img = document.createElement('img');
                // img.src = "https://a0.muscache.com/im/pictures/e94a2c71-d8c7-40dc-8ebd-5d519bc36a94.jpg?aki_policy=large";
                // document.body.appendChild(img);
                innerHTML = innerHTML + items_data[i]['picture_url'];
                // innerHTML = innerHTML + "https://a0.muscache.com/im/pictures/e94a2c71-d8c7-40dc-8ebd-5d519bc36a94.jpg?aki_policy=large";
                innerHTML = innerHTML + "\">";

                innerHTML = innerHTML + "<div class=\"caption\">";
                innerHTML = innerHTML + "<h3>" + items_data[i]['title'] + "</h3>";
                innerHTML = innerHTML + "<p>" + items_data[i]['address']['street'] + "</p>";
                // innerHTML = innerHTML + "<p>Zip: " + items_data[i]['address']['zip'] + "</p>";

                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"item" + i + "\" value=\"" + i + "\" href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</button>";
                // innerHTML = innerHTML + "<a href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</a>";
                innerHTML = innerHTML + "</div></div></div>";

                if (i % 2 == 1) {
                    innerHTML = innerHTML + "</div>";
                }
            }
            if (itemLength % 2 != 1) {
                innerHTML = innerHTML + "</div>";
            }

            innerHTML = innerHTML + "<div><table style='width: 100%;'><tbody>";
            innerHTML = innerHTML + "<td style='width:33%;'><button type=\"button\" class=\"btn btn-default\" id=\"itemPrePage\">Previous Page</button></td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:center;'> page " + (now_item_page+1) + "</td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:right;'><button type=\"button\" class=\"btn btn-default\" id=\"itemNextPage\">Next Page</button><td>";
            innerHTML = innerHTML + "</tbody></table><br><br>" + "</div>";

            $("#container").html(innerHTML);
            for (var i = 0; i < items_data.length; i++) {
                target_string = "#item" + i;
                $(target_string).click(function () {
                    houseDetail();
                });
            }

            $('#itemNextPage').click(function () {
                if (items_data.length>=10){
                    now_item_page++;
                    // alert("itemNextPage!");
                    itemRerender();
                }
            });
            $('#itemPrePage').click(function () {
                // alert("itemPrePage!");
                if (now_item_page != 0) {
                    now_item_page--;
                    // alert("itemNextPage!");
                    itemRerender();
                }
            });
        },
        error: function (e) {
            console.log(e);
            // alert("Unable to retrieve your data in render items.");
        }
    });
}

function enableMarker(marker, message) {
    var infowindow = new google.maps.InfoWindow({
        content: message
    });

    marker.addListener('click', function () {
        infowindow.open(marker.get('map'), marker);
    });
}


function itemRerender() {
    document.getElementById('brandName').innerHTML = "Housify | all houses";

    itemLength = 0;

    cleanData = {};
    now_page = [];
    items_id = [];

    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod?page=' + now_item_page,
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {
            // console.log(service_data);
            items_data = service_data['message'];
            console.log('two');
            console.log(items_data);
            items_data = items_data['results'];
            // console.log(items_data);
            //for (var item in items_data) {
                // console.log(item);
              //  itemLength++;
            //}
            itemLength= items_data.length;
            // console.log(itemLength);
            innerHTML = "";

            for (var i = 0; i < itemLength; i++) {
                // console.log("i= " + i + "\n");
                // console.log(items_data[i]['houseId']);
                //items_id.push(items_data[i]['houseId']);
                items_id.push(items_data[i]);
                now_page.push(0);
                // coords.push(items_data[i]['address']['coordinate']['lat']);
                // coords.push(items_data[i]['address']['coordinate']['lng']);

                // map part

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(items_data[i]['address']['coordinate']['lat'], items_data[i]['address']['coordinate']['lng']),
                    map: map
                });

                enableMarker(marker, items_data[i]['title']);

                // var infowindow = new google.maps.InfoWindow({
                //     content: items_data[i]['title']
                // });
                // marker.addListener('click', function () {
                //     map.setZoom(13);
                //     map.setCenter(marker.getPosition());
                //     infowindow.open(marker.get('map'), marker);
                // });

                // end of map part

                if (i % 2 == 0) {
                    innerHTML = innerHTML + "<div class=\"row\">";

                }

                innerHTML = innerHTML + "<div class=\"col-sm-6 col-md-4\">";
                innerHTML = innerHTML + "<div class=\"thumbnail\">";

                innerHTML = innerHTML + "<img src=\"";
                // // innerHTML = innerHTML + "images/" + items_data[i]['id'] + ".png\" " + "alt=\"" + items_data[i]['item_name'] + "\">";
                // innerHTML = innerHTML + "images/" + "placeholder.jpg\" " + "alt=\"" + items_data[i]['houseId'] + "\">";
                // img = document.createElement('img');
                // img.src = "https://a0.muscache.com/im/pictures/e94a2c71-d8c7-40dc-8ebd-5d519bc36a94.jpg?aki_policy=large";
                // document.body.appendChild(img);
                innerHTML = innerHTML + items_data[i]['picture_url'];
                // innerHTML = innerHTML + "https://a0.muscache.com/im/pictures/e94a2c71-d8c7-40dc-8ebd-5d519bc36a94.jpg?aki_policy=large";
                innerHTML = innerHTML + "\">";

                innerHTML = innerHTML + "<div class=\"caption\">";
                innerHTML = innerHTML + "<h3>" + items_data[i]['title'] + "</h3>";
                innerHTML = innerHTML + "<p>" + items_data[i]['address']['street'] + "</p>";
                // innerHTML = innerHTML + "<p>Zip: " + items_data[i]['address']['zip'] + "</p>";

                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"item" + i + "\" value=\"" + i + "\" href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</button>";
                // innerHTML = innerHTML + "<a href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</a>";
                innerHTML = innerHTML + "</div></div></div>";

                if (i % 2 == 1) {
                    innerHTML = innerHTML + "</div>";
                }
            }
            if (itemLength % 2 != 1) {
                innerHTML = innerHTML + "</div>";
            }

            innerHTML = innerHTML + "<div><table style='width: 100%;'><tbody>";
            innerHTML = innerHTML + "<td style='width:33%;'><button type=\"button\" class=\"btn btn-default\" id=\"itemPrePage\">Previous Page</button></td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:center;'> page " + (now_item_page+1) + "</td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:right;'><button type=\"button\" class=\"btn btn-default\" id=\"itemNextPage\">Next Page</button><td>";
            innerHTML = innerHTML + "</tbody></table><br><br>" + "</div>";

            $("#container").html(innerHTML);
            for (var i = 0; i < itemLength; i++) {
                target_string = "#item" + i;
                $(target_string).click(function () {
                    houseDetail();
                });
            }

            $('#itemNextPage').click(function () {
                if (itemLength>=10){
                    now_item_page++;
                    // alert("itemNextPage!");
                    itemRerender();
                }
            });
            $('#itemPrePage').click(function () {
                // alert("itemPrePage!");
                if (now_item_page != 0) {
                    now_item_page--;
                    // alert("itemNextPage!");
                    itemRerender();
                }
            });
        },
        error: function (e) {
            // alert("Unable to retrieve your data in item rerender.");
        }
    });
}

function render_items_login() {
    document.getElementById('brandName').innerHTML = "Housify | recommend for " + localStorage.getItem('username');

    itemLength = 0;

    cleanData = {};
    now_page = [];
    items_id = [];

    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/recommend?username=' + localStorage.getItem('username'),
        crossDomain: true,
        contentType: 'application/json',
        dataType: 'json',
        success: function (service_data) {
            // console.log('service_data: ' + service_data);
            console.log('service_data: ');
            console.log(service_data);


            if (service_data.msg==="no recommendation") {
                // alert('no recommendation');
                itemRerender();

            }

            items_data = service_data['msg']['result'];
            console.log('three');
            console.log(items_data);
            // alert('special delivery for ziba');
            // for (var item in items_data) {
            //     itemLength++;
            // }
            // console.log(service_data);
            itemLength = items_data.length;
            // alert('this shit length is '+ items_data.length);
            innerHTML = "";
            $("#container").html(innerHTML);
            var count = 0;
            result_data= items_data;
            for (var i = 0; i < itemLength; i++) {
                items_id.push(items_data[i]);
                now_page.push(0);
               

                count++;
                // alert('fired one ajax request');
                // console.log('items_data[i]: fuck this i '+i);
                innerHTML = "";

                //result_data = service_data['msg']['result'];

                // for (var i=0;i<result_data.length(); i++){
                // console.log(result_data[i]);
                
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(result_data[i]['house_detail']['address']['coordinate']['lat'], result_data[i]['house_detail']['address']['coordinate']['lng']),
                    map: map
                });

                enableMarker(marker, result_data['title']);

                if (i % 2 == 1) {
                    innerHTML = innerHTML + "<div class=\"row\">";
                }


                innerHTML = innerHTML + "<div class=\"col-sm-6 col-md-4\">";
                innerHTML = innerHTML + "<div class=\"thumbnail\">";

                innerHTML = innerHTML + "<img src=\"";
                innerHTML = innerHTML + result_data[i]['house_detail']['picture_url'];
                innerHTML = innerHTML + "\">";

                innerHTML = innerHTML + "<div class=\"caption\">";
                innerHTML = innerHTML + "<h3>" + result_data[i]['house_detail']['title'] + "</h3>";
                innerHTML = innerHTML + "<p>" + result_data[i]['house_detail']['address']['street'] + "</p>";
                // innerHTML = innerHTML + "<p>Zip: " + result_data[i]['house_detail']['address']['zip'] + "</p>";
                if (result_data[i]['recom_score']!=null){
               		innerHTML = innerHTML + "<p style=\"color:#F00\">Recommendation Score : <b>" + result_data[i]['recom_score'] + "</b></p>";
                }
                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"item" + i + "\" value=\"" + i + "\" href=\"#\" data-toggle=\"modal\" data-target=\"#houseInfoModal\">Details</button>";
                innerHTML = innerHTML + "</div></div></div>";

                // console.log(count);
                if (i % 2 == 0) {
                    innerHTML = innerHTML + "</div>";
                }
            
                // if ((i == itemLength-1) && (itemLength % 2 != 1)) {
                //     innerHTML = innerHTML + "</div>";
                // }
                // console.log(innerHTML);
                $("#container").append(innerHTML);

                target_string = "#item" + i;
                $(target_string).click(function () {
                    houseDetail();
                });
                                    
            }
            // alert('now we should have innerHTML ');
            // console.log(innerHTML);
            
        },
        error: function (e) {
            console.log('err: ');
            console.log(e);
            // alert("Unable to retrieve your data in item render login.");

            itemRerender();
        }
    });
}

accountDisplayHandler.userInfo = function () {
    // alert("should render user info");
    // console.log(jwt_token);
    //
    var user = localStorage.getItem("username");
    // console.log(user);
    cleanData = {};
    // cleanData['resource'] = 'customer';
    // cleanData['type'] = 'CustomerInfo';
    // cleanData['jwt'] = jwt_token;
    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/user/' + user,
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function(service_data){
           console.log(service_data);
           data = service_data['message']['results']['Item'];
           // console.log(data['email']);
           if(data['email']) $( '#profileEmail' ).val(data['email']);
           if (data['address']&&data['address']['street']) $( '#profileAddr' ).val(data['address']['street']);
           if (data['address']&&data['address']['city']) $( '#profileCity' ).val(data['address']['city']);
           if (data['address']&&data['address']['zip']) $( '#profileZipcode' ).val(data['address']['zip']);
           if(data['sex']=='female'){
                console.log("female");
                $( '#gender1' ).prop("checked", true);
           } else {
                $( '#gender2' ).prop("checked", true);
           }
           if (data['dob']) $( '#signUpDate' ).val(data['dob']);
        },
        error: function (e) {

           // alert("Unable to retrieve your data.");
           console.log(e);
        }
    });
}


// accountDisplayHandler.houseInfo = function(service_data) {

// }



function submitForm(formData, houseID, caller_num) {
    // TODO
    console.log(formData);
    cleanData = {};
    // cleanData['token'] = "fakeId";
    cleanData['houseId'] = houseID;
    cleanData['username'] = localStorage.getItem('username');
    cleanData['content'] = formData['commentContent'];
    cleanData['rating'] = formData['star'];
    // console.log(caller_num);

    $.ajax({
        type: "POST",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/comment',
        crossDomain: true,
        contentType: 'application/json',

        data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {
            // console.log("ahahahah")
            //TODO
            // accountDisplayHandler.logIn(formData.email);
            // $('#signUpModal').modal('hide')
            // alert("Please confirm your email.");
            // document.getElementById("houseInfoClose").click();
            alert("comment submit successful!");
            houseDetailRerender();
            // console.log(typeof(caller_num));
            // console.log(caller_num);
            // console.log("close complete");
            // console.log("item"+caller_num);
            // item_name = "item" + caller_num;
            // document.getElementById(item_name).click();
            // document.getElementById("item"+caller_num).click();
            // $('#'+caller_id).click();
        },
        failure: function (service_data) {
            // alert(data.errorMessage)
            alert("Unable to submit comment");
        }
    });
}

function submitProfileForm(formData){
    // console.log(formData);
    var username = localStorage.getItem('username');
    console.log(formData);
    cleanData = {};
    cleanData['username'] = username;
    cleanData['email'] = formData['email'] ? formData['email']: "" ;
    cleanData['city'] = formData['city'] ? formData['city']: "" ;
    cleanData['street'] = formData['address'] ? formData['address']: "" ;
    cleanData['zip'] = formData['zipcode'] ? formData['zipcode']: "" ;
    cleanData['sex'] = formData['gender'] ? formData['gender']: "" ;
    cleanData['dob'] = $('#signUpDate').val() ;
    console.log(cleanData);

        // "username": "ziba2",
        // "email": "testttt@mail.com",
        // "phone": "111",
        // "street": "204 W 108 St",
        // "city": "New York",
        // "states": "NY",
        // "zip": 10025,
        // "preference": "fake pref",
        // "sex": "none"

    $.ajax({
        type: "PUT",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/user/' + username,
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {
            // alert("hahahahahah");
            // alert("comment submit successful!");
            // houseDetailRerender();
            console.log(service_data);
            alert("Update success!");
            $('#profileClose').click();
            
        },
        failure: function (service_data) {
            alert("Unable to update profile.");
        }
    });
}

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

function houseDetail() {
    commentLength = 0;
    // console.log(cleanData);
    caller_num = event.target.value;
    console.log('items_id: '+items_id);
    console.log(items_id[parseInt(event.target.value)]);
    if (items_id[parseInt(event.target.value)]['house_detail']==null){
    	caller_id= items_id[parseInt(event.target.value)]['houseId'];
    	console.log('item_id_next_house:'+items_id[parseInt(event.target.value)]['houseId']);
    }else{
    	caller_id=items_id[parseInt(event.target.value)]['house_detail']['houseId'];
    	console.log('item_id_next_house:'+items_id[parseInt(event.target.value)]['house_detail']['houseId']);
    }
    //console.log('item_id_next_house:'+items_id[parseInt(event.target.value)]['houseId']);
    //caller_id = items_id[parseInt(event.target.value)]['houseId'];
    console.log(caller_id);

    cleanData = {};
    cleanData['username'] = localStorage.getItem('username');
    // console.log(localStorage.getItem('username'));
    cleanData['houseId'] = caller_id;
    /* log post */
    $.ajax({
        type: "POST",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/logdata',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {
            // alert('Helaoshi shi shabi!');
        },
        error: function (e) {
            alert("Fail to upload log data.");
        }
    });
    /* detail post */
    console.log(caller_id);
    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/house/' + caller_id + "?page=" + now_page[parseInt(caller_num)],
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {

            console.log(service_data);
            if (service_data) items_data = service_data['house'];
            console.log('items_data '+items_data);
            items_data['title'] = (items_data['title']!=null) ? items_data['title']: "";
            console.log(items_data['title']);
            items_data['size'] =  (items_data['size']!=null) ? items_data['size']: "";
            items_data['address']['street'] =  (items_data['address']['street']!=null) ? items_data['address']['street']: "";
            items_data['address']['zip'] = (items_data['address']['zip']!=null) ? items_data['address']['zip']: "";
            // items_data = items_data['Item'];
            innerHTML = "";
            // console.log(items_data);

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

            items_data = service_data['comment'];
            commentLength = items_data.length;
            // console.log(items_data);

            innerHTML = innerHTML + "<table class=\"table\">";
            innerHTML = innerHTML + "<thead><tr>";
            // innerHTML = innerHTML + "<th>#</th>";
            innerHTML = innerHTML + "<th>Reviewer</th>";
            // innerHTML = innerHTML + "<th>ID</th>";
            innerHTML = innerHTML + "<th>Rating</th>";
            innerHTML = innerHTML + "<th>Content</th>";
            // innerHTML = innerHTML + "<th>Zip</th>";
            innerHTML = innerHTML + "</tr></thead>";
            innerHTML = innerHTML + "<tbody>";

            for (var i = 0; i < items_data.length; i++) {
                // cart_items.push(items_data[i]['id']);
                innerHTML = innerHTML + "<tr>";
                innerHTML = innerHTML + "<td>" + items_data[i]['reviewerName'] + "</td>";
                // innerHTML = innerHTML + "<td>" + items_data[i]['houseId'] + "</td>";

                innerHTML = innerHTML + "<td>" + items_data[i]['rating'] + "</td>";
                innerHTML = innerHTML + "<td>" + items_data[i]['content'] + "</td>";
                // innerHTML = innerHTML + "<td>" + items_data['address']['zip'] + "</td>";
                innerHTML = innerHTML + "</tr>";

            }
            innerHTML = innerHTML + "</tbody></table>";

            /* button of page */
            innerHTML = innerHTML + "<table style='width: 100%;'><tbody>";
            innerHTML = innerHTML + "<td style='width:33%;'><button type=\"button\" class=\"btn btn-default\" id=\"prePage\">Previous Page</button></td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:center;'> page " + (now_page[parseInt(caller_num)]+1) + "</td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:right;'><button type=\"button\" class=\"btn btn-default\" id=\"nextPage\">Next Page</button><td>";
            innerHTML = innerHTML + "</tbody></table><br><br>";
            /* end of button of page */

            /* end of comment part */
            var user = localStorage.getItem("token");
            /* submit comment part */
            if (user) {
                innerHTML = innerHTML + "<form id=\"commentForm\">";
                innerHTML = innerHTML + '<div class="form-group" style="background: rgba(250,250,249,0.9);border:1px solid #bbb;padding:10px;border-radius:3px;box-shadow:inset 0 1px 2px rgba(0,0,0,0.15);">';

                innerHTML = innerHTML + "<label for=\"commentContent\">Comment Content</label>";

                innerHTML = innerHTML + "<div class=\"stars\" id=\"stars\">";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-1\" id=\"star-1\" value=\"1\"/>";
                innerHTML = innerHTML + "<label class=\"star-1\" for=\"star-1\">1</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-2\" id=\"star-2\" value=\"2\"/>";
                innerHTML = innerHTML + "<label class=\"star-2\" for=\"star-2\">2</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-3\" id=\"star-3\" value=\"3\"/>";
                innerHTML = innerHTML + "<label class=\"star-3\" for=\"star-3\">3</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-4\" id=\"star-4\" value=\"4\"/>";
                innerHTML = innerHTML + "<label class=\"star-4\" for=\"star-4\">4</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-5\" id=\"star-5\" value=\"5\"/>";
                innerHTML = innerHTML + "<label class=\"star-5\" for=\"star-5\">5</label>";

                innerHTML = innerHTML + '<span></span></div><hr style="margin-top:5px; margin-bottom: 10px">';
                innerHTML = innerHTML + "<textarea rows='5' style='background: rgba(250,250,249,0.9);' type=\"comment\" class=\"form-control\" id=\"commentContent\" placeholder=\"Comment Content\" name=\"commentContent\"></textarea>";
                innerHTML = innerHTML + "</div>";

                innerHTML = innerHTML + "<button type=\"submit\" class=\"btn btn-default\">Submit Comment</button></form>";

                /* end of submit comment part */

                $("#houseContent").html(innerHTML);

                /* new comment function */
                $('#commentForm').submit(function (e) {
                    e.preventDefault();
                    var formData = $(this).serializeArray().reduce(
                        function (accumulater, curr) {
                            accumulater[curr.name] = curr.value;
                            return accumulater;
                        }
                        , {});
                    // console.log(document.getElementById("stars"));
                    // console.log($( '#star-1' ));
                    // console.log($( '#star-2' ));
                    // console.log($( '#star-3' ));
                    // console.log($( '#star-4' ));
                    // console.log($( '#star-5' ));
                    // var temp = document.getElementsByName("star");
                    // var ratio = "";
                    // for(var i=0;i<temp.length;i++){
                    //     if(temp[i].checked){
                    //         radio = temp[i].value; 
                    //     }
                    // }
                    // console.log(ratio);
                    submitForm(formData, caller_id, caller_num);
                    // submitForm(formData, service_data['house']['houseId'], caller_num);
                });
            }
            else {
                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"jumpLogin\" data-toggle=\"modal\" data-target=\"#loginModal\">Login to make a comment</button>";
                $("#houseContent").html(innerHTML);
                $('#jumpLogin').click(function () {
                    // alert("Close!");
                    document.getElementById("houseInfoClose").click();
                    // document.getElementById("loginNavElement").click();
                });

            }

            $('#nextPage').click(function () {
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("loginNavElement").click();
                // alert("Next Page!");
                // console.log(service_data['message']['comment'].length);
                // alert(commentLength);
                if (commentLength>=10){
                    now_page[parseInt(caller_num)]++;
                    houseDetailRerender();
                }
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("item"+caller_num).click();
            });
            $('#prePage').click(function () {
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("loginNavElement").click();
                // alert("Next Page!");
                if (now_page[parseInt(caller_num)] != 0) {
                    now_page[parseInt(caller_num)]--;
                    houseDetailRerender();
                }
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("item"+caller_num).click();
            });

        },
        error: function (e) {
            alert("Unable to view details.");
        }
    });
}

function houseDetailRerender() {

    commentLength = 0;

    cleanData = {};
    cleanData['username'] = localStorage.getItem('username');
    // console.log(localStorage.getItem('username'));
    cleanData['houseId'] = caller_id;
    /* log post */
    $.ajax({
        type: "POST",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/logdata',
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {
            // alert('Helaoshi shi shabi!');
        },
        error: function (e) {
            alert("Fail to upload log data.");
        }
    });
    /* detail post */
    $.ajax({
        type: "GET",
        url: 'https://a4j8o4le0e.execute-api.us-east-1.amazonaws.com/prod/house/' + caller_id + "?page=" + now_page[parseInt(caller_num)],
        crossDomain: true,
        contentType: 'application/json',
        // data: JSON.stringify(cleanData),
        dataType: 'json',
        success: function (service_data) {

            console.log(service_data);
            if (service_data)
            items_data = service_data['house'];
            // items_data = items_data['Item'];
            innerHTML = "";
            // console.log(items_data);

            innerHTML = "";
            innerHTML = innerHTML + "<table class=\"table\">";
            innerHTML = innerHTML + "<thead><tr>";
            // innerHTML = innerHTML + "<th>#</th>";
            innerHTML = innerHTML + "<th>Name</th>";
            // innerHTML = innerHTML + "<th>ID</th>";
            innerHTML = innerHTML + "<th>Title</th>";
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
            // innerHTML = innerHTML + "<td>" + items_data[i]['houseId'] + "</td>";
            innerHTML = innerHTML + "<td>" + items_data['size'] + "</td>";
            innerHTML = innerHTML + "<td>" + items_data['address']['street'] + "</td>";
            innerHTML = innerHTML + "<td>" + items_data['address']['zip'] + "</td>";
            innerHTML = innerHTML + "</tr>";
            // }

            /* comment part */

            items_data = service_data['comment'];
            commentLength = items_data.length;
            // console.log(items_data);

            innerHTML = innerHTML + "<table class=\"table\">";
            innerHTML = innerHTML + "<thead><tr>";
            // innerHTML = innerHTML + "<th>#</th>";
            innerHTML = innerHTML + "<th>Reviewer</th>";
            // innerHTML = innerHTML + "<th>ID</th>";
            innerHTML = innerHTML + "<th>Rating</th>";
            innerHTML = innerHTML + "<th>Content</th>";
            // innerHTML = innerHTML + "<th>Zip</th>";
            innerHTML = innerHTML + "</tr></thead>";
            innerHTML = innerHTML + "<tbody>";

            for (var i = 0; i < items_data.length; i++) {
                // cart_items.push(items_data[i]['id']);
                innerHTML = innerHTML + "<tr>";
                innerHTML = innerHTML + "<td>" + items_data[i]['reviewerName'] + "</td>";
                // innerHTML = innerHTML + "<td>" + items_data[i]['houseId'] + "</td>";
                innerHTML = innerHTML + "<td>" + items_data[i]['rating'] + "</td>";
                innerHTML = innerHTML + "<td>" + items_data[i]['content'] + "</td>";
                // innerHTML = innerHTML + "<td>" + items_data['address']['zip'] + "</td>";
                innerHTML = innerHTML + "</tr>";

            }
            innerHTML = innerHTML + "</tbody></table>";

            /* button of page */
            innerHTML = innerHTML + "<table style='width: 100%;'><tbody>";
            innerHTML = innerHTML + "<td style='width:33%;'><button type=\"button\" class=\"btn btn-default\" id=\"prePage\">Previous Page</button></td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:center;'> page " + (now_page[parseInt(caller_num)]+1) + "</td>";
            innerHTML = innerHTML + "<td style='width:33%;text-align:right;'><button type=\"button\" class=\"btn btn-default\" id=\"nextPage\">Next Page</button><td>";
            innerHTML = innerHTML + "</tbody></table><br><br>";
            /* end of button of page */

            /* end of comment part */
            var user = localStorage.getItem("token");
            /* submit comment part */
            if (user) {
                innerHTML = innerHTML + "<form id=\"commentForm\">";
                innerHTML = innerHTML + '<div class="form-group" style="background: rgba(250,250,249,0.9);border:1px solid #bbb;padding:10px;border-radius:3px;box-shadow:inset 0 1px 2px rgba(0,0,0,0.15);">';

                innerHTML = innerHTML + "<label for=\"commentContent\">Comment Content</label>";

                innerHTML = innerHTML + "<div class=\"stars\" id=\"stars\">";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-1\" id=\"star-1\" value=\"1\"/>";
                innerHTML = innerHTML + "<label class=\"star-1\" for=\"star-1\">1</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-2\" id=\"star-2\" value=\"2\"/>";
                innerHTML = innerHTML + "<label class=\"star-2\" for=\"star-2\">2</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-3\" id=\"star-3\" value=\"3\"/>";
                innerHTML = innerHTML + "<label class=\"star-3\" for=\"star-3\">3</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-4\" id=\"star-4\" value=\"4\"/>";
                innerHTML = innerHTML + "<label class=\"star-4\" for=\"star-4\">4</label>";
                innerHTML = innerHTML + "<input type=\"radio\" name=\"star\" class=\"star-5\" id=\"star-5\" value=\"5\"/>";
                innerHTML = innerHTML + "<label class=\"star-5\" for=\"star-5\">5</label>";

                innerHTML = innerHTML + '<span></span></div><hr style="margin-top:5px; margin-bottom: 10px">';
                innerHTML = innerHTML + "<textarea rows='5' style='background: rgba(250,250,249,0.9);' type=\"comment\" class=\"form-control\" id=\"commentContent\" placeholder=\"Comment Content\" name=\"commentContent\"></textarea>";
                innerHTML = innerHTML + "</div>";

                innerHTML = innerHTML + "<button type=\"submit\" class=\"btn btn-default\">Submit Comment</button></form>";

                /* end of submit comment part */

                $("#houseContent").html(innerHTML);

                /* new comment function */
                $('#commentForm').submit(function (e) {
                    e.preventDefault();
                    var formData = $(this).serializeArray().reduce(
                        function (accumulater, curr) {
                            accumulater[curr.name] = curr.value;
                            return accumulater;
                        }
                        , {});
                    // submitForm(formData, service_data['house']['houseId'], caller_num);
                    submitForm(formData, caller_id, caller_num);
                });
            }
            else {
                innerHTML = innerHTML + "<button type=\"button\" class=\"btn btn-default\" id=\"jumpLogin\" data-toggle=\"modal\" data-target=\"#loginModal\">Login to make a comment</button>";
                $("#houseContent").html(innerHTML);
                $('#jumpLogin').click(function () {
                    // alert("Close!");
                    document.getElementById("houseInfoClose").click();
                    // document.getElementById("loginNavElement").click();
                });

            }

            $('#nextPage').click(function () {
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("loginNavElement").click();
                // alert("Next Page!");
                // console.log(service_data['message']['comment'].length);
                // alert(commentLength);
                if (commentLength>=10){
                    now_page[parseInt(caller_num)]++;
                    houseDetailRerender();
                }
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("item"+caller_num).click();
            });
            $('#prePage').click(function () {
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("loginNavElement").click();
                // alert("Next Page!");
                if (now_page[parseInt(caller_num)] != 0) {
                    now_page[parseInt(caller_num)]--;
                    houseDetailRerender();
                }
                // document.getElementById("houseInfoClose").click();
                // document.getElementById("item"+caller_num).click();
            });

        },
        error: function (e) {
            alert("Unable to view details.");
        }
    });
}

function initMap() {

    init_position = [];
    init_position['lat'] = 40.8089675;
    init_position['lng'] = -73.9599175;

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: init_position['lat'], lng: init_position['lng']},
        styles: [{
            "featureType": "water",
            "stylers": [{"saturation": 43}, {"lightness": -11}, {"hue": "#0088ff"}]
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [{"hue": "#ff0000"}, {"saturation": -100}, {"lightness": 99}]
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#808080"}, {"lightness": 54}]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ece2d9"}]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#ccdca1"}]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#767676"}]
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#ffffff"}]
        }, {"featureType": "poi", "stylers": [{"visibility": "off"}]}, {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{"visibility": "on"}, {"color": "#b8cb93"}]
        }, {"featureType": "poi.park", "stylers": [{"visibility": "on"}]}, {
            "featureType": "poi.sports_complex",
            "stylers": [{"visibility": "on"}]
        }, {"featureType": "poi.medical", "stylers": [{"visibility": "on"}]}, {
            "featureType": "poi.business",
            "stylers": [{"visibility": "simplified"}]
        }]
    });
    // console.log(coords);
    // console.log(coords.length);

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(
            function (position) {
                init_position['lat'] = position.coords.latitude;
                init_position['lng'] = position.coords.longitude;
                console.log("current position: ",init_position);
                map.setZoom(11);
                map.setCenter({lat: init_position['lat'], lng: init_position['lng']});
            }
        )
    }
}

function ResponseHandler(e, item_id) {
    e.preventDefault();
    console.log("response function");
    $.ajax({
        url: $('#item' + item_id).attr('action'),
        type: "POST",
        data: $('#item' + item_id).serialize(),
        success: function (response) {
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

$(document).ready(function () {

    if (localStorage.getItem('username')!=null){
        is_recommendation = 1;
        render_items_login();
    } else {
        is_recommendation = 0;
        render_items();
    }
    accountDisplayHandler.logOut();

    /* new comment function */
    $('#commentForm').submit(function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray().reduce(
            function (accumulater, curr) {
                accumulater[curr.name] = curr.value;
                return accumulater;
            }
            , {});
        submitForm(formData);
    });

    $('#profileForm').submit(function (e) {
        e.preventDefault();
        var formData = $(this).serializeArray().reduce(
            function (accumulater, curr) {
                accumulater[curr.name] = curr.value;
                return accumulater;
            }
            , {});
        submitProfileForm(formData);
    });

    $("#usernameNavElement").click(function () {
        accountDisplayHandler.userInfo();
    });
    
    $("#brandName").click(function () {
        if (is_recommendation){
            is_recommendation = 0;
            render_items();
        } else {
            if (localStorage.getItem('username')!=null){
                is_recommendation = 1;
                render_items_login();
            }
        }   
    });

    $("#datetimepicker").datetimepicker({
        pickTime: false
    });
});
