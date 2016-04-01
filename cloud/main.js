require('cloud/app.js');

//Definition of getContacts
Parse.Cloud.define("getContacts", function(request, response) {
  var query = new Parse.Query("Contact");
  query.equalTo("user", Parse.User.current());
  query.find({
    success: function(userContacts) {
      // userPosts contains all of the posts by the current user.
      response.success(userContacts);
    },

    error: function(){
      response.error('contacts lookup failed');
    }
  });
});

//================================================================
//		ORIGINAL CODE
//================================================================
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("totalBooks", function(request, response) {
  var query = new Parse.Query("Book");
  query.equalTo("Book", request.params.book);
  query.find({
    success: function(results) {
      var sum = "i is: ";
      for (var i = 0; i <= results.length; i++) {
	        	sum+= i;		        
      }
      response.success(sum);
    },
    error: function() {
      response.error("user lookup failed");
    }
  });
});

// Parse.Cloud.define("sendMail", function(request, response) {
// var Mandrill = require('mandrill');
// Mandrill.initialize('t0aUB64xNENaWHqGbOWh6g');
// 
// Mandrill.sendEmail({
// message: {
// text: request.params.text,
// subject: request.params.subject,
// from_email: request.params.fromEmail,
// from_name: request.params.fromName,
// to: [
// {
// email: request.params.toEmail,
// name: request.params.toName
// }
// ]
// },
// async: true
// },{
// success: function(httpResponse) {
// console.log(httpResponse);
// response.success("Email sent!");
// },
// error: function(httpResponse) {
// console.error(httpResponse);
// response.error("Uh oh, something went wrong");
// }
// });
// });
