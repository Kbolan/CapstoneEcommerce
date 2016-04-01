// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var app = express();
var Mandrill = require('mandrill');
Mandrill.initialize('t0aUB64xNENaWHqGbOWh6g');


// Global app configuration section
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
app.use(parseExpressCookieSession({
  fetchUser: true,
  key: 'image.sess',
  cookie: {
    maxAge: 3600000 * 24 * 30
  }
}));

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {

  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  // Render a public welcome page, with a link to the '/' endpoint.
  var AvailableBooks = Parse.Object.extend("Books");
  var query = new Parse.Query(AvailableBooks);
  // Only retrieve 36
  query.limit(12);
  var books = [];

  //query.descending("createdAt");
  query.find({
  success: function(results) {
		for (var i = 0; i < results.length; i++) {
		  // pass result to books array
			books[i] = results[i].toJSON();
		}
	  res.render('index', {user: user, books: books, queryBooks: [], authors: []});
  },
  error: function(error) {
    // There was an error.
      res.render('index', {user: user, books: [], queryBooks: [], authors: []});
  }
  });
});

app.get('/sellThisBook/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var book = Parse.Object.extend("Books");
  var query = new Parse.Query(book);
  var bookInfo = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        bookInfo = results[0].toJSON();
      }
      res.render('sellThisBook', {user: user, bookInfo: bookInfo});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/bookDetails/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var book = Parse.Object.extend("Books");
  var query = new Parse.Query(book);
  var book = undefined;

  query.equalTo("ISBN", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        book = results[0].toJSON();
      }
      res.render('bookDetails', {user: user, book: book});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/viewBuyerInformation/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var buyerInfo = Parse.Object.extend("User");
  var query = new Parse.Query(buyerInfo);
  var buyer = undefined;

  query.equalTo("username", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        buyer = results[0].toJSON();
      }
      res.render('viewBuyerInformation', {user: user, buyer: buyer});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/sellerFeedback/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var sellerInfo = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        sellerInfo = results[0].toJSON();
      }
      res.render('sellerFeedback', {user: user, sellerInfo: sellerInfo});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/buyerFeedback/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var buyerInfo = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        buyerInfo = results[0].toJSON();
      }
      res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/viewFeedback/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var feedback = Parse.Object.extend("Feedback");
  var query = new Parse.Query(feedback);
  var feedbackInfo = [];
  var temp = req.params.id;

  query.equalTo("userRated", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          feedbackInfo[i] = results[i].toJSON();
        }
        res.render('viewFeedback', {user: user, feedbackInfo: feedbackInfo, reviewName: temp});
      }
      else{
        res.render('viewFeedback', {user: user, feedbackInfo: undefined, reviewName: req.params.id});
      }

    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }
});

});

app.get('/book/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }
  var book = undefined;
  var bookListings = [];

  var Books = Parse.Object.extend("Books");
  var bookQuery = new Parse.Query(Books);

  var BookListings = Parse.Object.extend("BookListings");
  var listingQuery = new Parse.Query(BookListings);

  if(typeof req.params.op != "undefined"){
    var TempPurchase = Parse.Object.extend("TempPurchase");
    var query = new Parse.Query(TempPurchase);
    query.equalTo("buyer", Parse.User.current().get('username'));
    query.find({
      success: function(results) {
        // update record
        if (results.length > 0) {
          var object = results[0];
          object.destroy({
            success: function(myObject) {
            },
            error: function(myObject, error) {
            // The delete failed.
            // error is a Parse.Error with an error code and message.
            }
          });
        }
      },
      error: function(error) {
      }
    });
  }

  bookQuery.equalTo("objectId", req.params.id);
  bookQuery.find({
    success: function(results) {
      if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
          // pass result to books array
          book = results[i].toJSON();
        }



        listingQuery.equalTo("ISBN", book.ISBN);
        listingQuery.find({
          success: function(results) {
            if (results.length > 0) {
              var k = 0;
            for (var i = 0; i < results.length; i++) {
                  // pass result to books array
                  if(results[i].toJSON().activeStatus === "active"){
                    bookListings[k] = results[i].toJSON();
                    k++;
                  }
                }
              }
              res.render('book', {user: user, book: book, bookListings: bookListings});
            },
          error: function(error){
            res.render('book', {user: user, book: book, bookListings: bookListings});
          }
          });
      }
    },
    error: function(error){
      res.render('book', {user: user, book: book, bookListings: bookListings});
    }
  });
});


app.get('/sellersListings', function(req, res){
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  var bookListing = Parse.Object.extend("BookListings");
  var query = new Parse.Query(bookListing);
  var books = [];

  query.contains("Seller", user.get('username'));

  query.find({
  	success: function(results) {
  		if(results.length > 0) {
  			for(var i = 0; i < results.length; i++){
  				books[i] = results[i].toJSON();
  			}
  			res.render('sellersListings', {user: user, books: books});
  		}
      else{
        res.render('sellersListings', {user: user, books: undefined});
      }
  	},
	   error: function(error){
	   	//res.render('index', {user: user});
	   }

  });
});

app.get('/manageOrders', function(req, res){
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }
  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var books = [];
  var temp1 = [];
  var buyerAddress = [];
  var bookTitle = [];


  var buyerName = Parse.Object.extend("User");
  var query2 = new Parse.Query(buyerName);

  var bookTitles = Parse.Object.extend("Books");
  var query3 = new Parse.Query(bookTitles);

  query.ascending("objectId");
  query.contains("seller", user.get('username'));

  query.find({
    success: function(results) {
      if(results.length > 0) {
        for(var i = 0; i < results.length; i++){
            books[i] = results[i].toJSON();
            temp1[i] = results[i].toJSON().buyer;
          }
          res.render('manageOrders', {user: user, books: books, buyerAddress: buyerAddress, bookTitle: bookTitle});

      }
      else{
        res.render('manageOrders', {user: user, books: undefined});
      }

    },
     error: function(error){
       //res.render('index', {user: user});
     }
  });

});

app.get('/recentPurchases', function(req, res){
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }
  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var books = [];
  var bookTitle = [];

  //var bookTitle = Parse.Object.extend("Books");
  //var query2 = new Parse.Query(bookTitle);

  query.ascending("objectId");
  query.contains("buyer", user.get('username'));
  query.find({
    success: function(results) {
      if(results.length > 0) {
        for(var i = 0; i < results.length; i++){
            books[i] = results[i].toJSON();
          }
          res.render('recentPurchases', {user: user, books: books});

      }
      else{
        res.render('recentPurchases', {user: user, books: undefined});
      }

    },
     error: function(error){
       res.render('index', {user: user});
     }
  });
});




app.get('/manageSellerInventory', function(req, res){
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  var bookListing = Parse.Object.extend("BookListings");
  var query = new Parse.Query(bookListing);
  var books = [];
  var booksInactive = [];
  query.ascending("objectId");
  query.contains("Seller", user.get('username'));


  query.find({
    success: function(results) {
      if(results.length > 0) {
        var k = 0;
        var j = 0;
        for(var i = 0; i < results.length; i++){

          var statusCheck = results[i].toJSON();
          if(statusCheck.activeStatus == "active"){
            books[k] = statusCheck;
            k++;
          }
        }
        for(var i = 0; i < results.length; i++){

          var statusCheck = results[i].toJSON();
          if(statusCheck.activeStatus == "inactive"){
            booksInactive[j] = statusCheck;
            j++;
          }
        }
        if(books.length === 0){
          res.render('manageSellerInventory', {user: user, books: undefined, booksInactive: booksInactive});
        }
        else if(booksInactive.length === 0){
          res.render('manageSellerInventory', {user: user, books: books, booksInactive: undefined});
        }
        else{
          res.render('manageSellerInventory', {user: user, books: books, booksInactive: booksInactive});
        }
      }
      else{
        res.render('manageSellerInventory', {user: user, books: undefined, booksInactive: undefined});
      }

    },
     error: function(error){
       //res.render('index', {user: user});
     }

  });
});

app.get('/userProfile', function(req, res) {
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }
	res.render('userProfile', {user: user});
});

app.get('/about', function(req, res) {

  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  res.render('about', {user: user});
});

app.get('/contact', function(req, res) {

  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  res.render('contact', {user: user});
});
app.get('/sellBook', function(req, res) {

  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }

  res.render('sellBook', {user: user});
});

app.get('/resetPassword', function(req, res) {
  res.render('resetPassword');
});

app.get('/addPayPalAccount', function(req, res){
    if( Parse.User.current()) {
       var user = Parse.User.current();
    }
    else{
       var user = undefined;
    }

    res.render('addPayPalAccount', {user: user});
});


app.post('/', function(req, res) {
    var user = undefined;
    var username = req.body.username;

    Parse.User.logIn(username, req.body.password).then(function(user) {
     if(!user.get('emailVerified')){
        res.render('login', {message: undefined, error1: "Email must be verified before you can log in!"});
      }
      else{
        res.render('userProfile', {user: Parse.User.current()});
      }
    },
    function(error) {
      var userName = Parse.Object.extend("User");
      var userQuery = new Parse.Query(userName);


      userQuery.equalTo("username", username);
      userQuery.find({
        success: function(results){
          if (results.length < 1){
            res.render('login', {message: undefined, error1: "Invalid username"});
          }
          else{
            res.render('login', {message: undefined, error1: "Incorrect Password"})
          }
        }
      });
    });
  });

app.get('/login', function(req, res) {

  res.render('login');
});

app.post('/search', function(req, res) {
	if( Parse.User.current()) {
		var user = Parse.User.current();
	} else{
		var user = undefined;
	}
	var AvailableBooks = Parse.Object.extend("Books");
  	var query = new Parse.Query(AvailableBooks);
  	var query2 = new Parse.Query(AvailableBooks);

	var searchText = req.body.appendedInputButtons;
	var queryBooks = [];
	var authors = [];

	if(isNaN(searchText)) {
		query.contains("Title", req.body.appendedInputButtons);
		query2.contains("Author", req.body.appendedInputButtons);
	}
	else {
		// length 10
		if (searchText.toString().length == 10) {
			query.equalTo("isbn_10", req.body.appendedInputButtons);
		} else { // length 13
// 			query.equalTo("isbn_13", req.body.appendedInputButtons);
			query.equalTo("ISBN", req.body.appendedInputButtons);
		}
	}
	query.find({
	  success: function(results) {
	  		if (results.length > 0) {
				for (var i = 0; i < results.length; i++) {
				  // pass result to books array
					queryBooks[i] = results[i].toJSON();
				}
			  res.render('index', {user: user, books: [], queryBooks: queryBooks, authors: []});
			} else{
				query2.find({
				  success: function(results) {
						if (results.length > 0) {
							for (var i = 0; i < results.length; i++) {
							  // pass result to books array
								authors[i] = results[i].toJSON();
							}
						}
					res.render('index', {user: user, books: [], queryBooks: queryBooks, authors: authors});
				  },
				  error: function(error) {
					// There was an error.
					  res.render('index', {user: user, books: [], queryBooks: [], authors: []});
				  }
				});
			}
	  },
	  error: function(error) {
		// There was an error.
		  res.render('index', {user: user, books: [], queryBooks: [], authors: []});
	  }
	});
});

app.post('/logout', function(req, res){
	Parse.User.logOut();
	res.redirect('/');
});


app.get('/register', function(req, res) {
  res.render('register', {message: undefined, error1: undefined, error2: undefined});
});

app.post('/register', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var passwordRetype = req.body.passwordRetype;
	var atpos = email.indexOf('@');
	var dotpos = email.lastIndexOf('.');

	if(email  == null || email == '') {
		e = 'Email must be filled out';
		res.render('register', {message: undefined, error1: e});
		return;
	} else if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		e = 'Not a valid e-mail address';
		res.render('register', {message: undefined, error1: e});
			return;
    } else if(password == null || password == '')	{
		e = 'Password must be filled out';
		res.render('register', {message: undefined, error1: e});
			return;
	} else if(passwordRetype == null || passwordRetype == '' || passwordRetype !== password)	{
		e = 'Password verification failed, please verify password';
		res.render('register', {message: undefined, error1: e});
			return;
	}
  if(password != "" && password == passwordRetype) {
      if(password.length < 8) {
        e = 'Password must be longer than 8 characters';
        res.render('register', {message: undefined, error1: e});
        return;
      }
      if(password == email) {
        e = 'Password must be different from username';
        res.render('register', {message: undefined, error1: e});
        return;
      }
      re = /[0-9]/;
      if(!re.test(password)) {
        e = 'password must contain at least one number';
        res.render('register', {message: undefined, error1: e});
        return;
      }
      re = /[a-z]/;
      if(!re.test(password)) {
        e = 'password must contain at least one lowercase letter';
        res.render('register', {message: undefined, error1: e});
        return;
      }
      re = /[A-Z]/;
      if(!re.test(password)) {
        e = 'password must contain at least one capital letter';
        res.render('register', {message: undefined, error1: e});
        return;;
      }
    }

	// Simple syntax to create a new subclass of Parse.Object.
		var user = new Parse.User();
		user.set("username", email);
		user.set("password", password);
		user.set("email", email);
    user.set("userType", "Buyer");

		user.signUp(null, {
		  success: function(user) {
			// Hooray! Let them use the app now.
			  res.render('register', { message: 'Congrats, you just registered!' });
		  },
		  error: function(user, error) {
			// Show the error message somewhere and let the user try again.
			  res.render('register', { message: 'Error: ' + error.message });
		  }
		});

});


app.get('/editAddress', function(req, res) {
  if( Parse.User.current()) {
     var user = Parse.User.current();
  }
  else{
     var user = undefined;
  }
	res.render('editAddress', {user: user});
});

app.post('/editAddress', function(req, res) {
	var addressLine1 = req.body.addressLine1;
	var addressLine2 = req.body.addressLine2;
	var city = req.body.city;
	var stateCode = req.body.stateCode;
	var zipCode = req.body.zipCode;
	var user = Parse.User.current();

	if(addressLine1  == null || addressLine1 == '') {
		e = 'Address Line 1 must be filled out';
		res.render('editAddress', {user: user, message: undefined, error1: e});
		return;
	} else if(city == null || city == '')	{
		e = 'City must be filled out';
		res.render('editAddress', {user: user, message: undefined, error1: e});
			return;
	} else if(stateCode == null || stateCode == '')	{
		e = 'State code must be filled out';
		res.render('editAddress', {user: user, message: undefined, error1: e});
			return;
	} else if(zipCode == null || zipCode == '')	{
		e = 'Zip code must be filled out';
		res.render('editAddress', {user: user, message: undefined, error1: e});
			return;
	}


	user.set("addressLine1", addressLine1);
	user.set("addressLine2", addressLine2);
	user.set("city", city);
	user.set("stateCode", stateCode);
	user.set("zipCode", zipCode);

	//check is user has a bankName to determine if will be a seller after
	//their address is entered
	if(user.get('PayPalEmailAdress') !== undefined){
		user.set('userType', "Buyer and Seller");
				user.save(null, user);
				res.render('userProfile', { user: user });
  }
	else{
		user.save(null, user);
		res.render('userProfile', { user: user });
	}

});

app.get('/contacted', function(req, res) {
  res.render('contacted');
});

app.get('/purchased/:id?', function(req, res) {
	if( Parse.User.current()) {
		var user = Parse.User.current();
	} else{
		var user = undefined;
	}

	if(typeof req.params.id != "undefined"){
		var Purchase = Parse.Object.extend("Purchases");
		var purchases = new Purchase();

		var BookListings = Parse.Object.extend("BookListings");
		var listingQuery = new Parse.Query(BookListings);

		var TempPurchase = Parse.Object.extend("TempPurchase");
		var query = new Parse.Query(TempPurchase);
		query.equalTo("buyer", Parse.User.current().get('username'));
		query.find({
			success: function(results) {
				// update record
				if (results.length > 0) {
					var object = results[0];
					purchases.set("buyer", object.get('buyer'));
					purchases.set("seller", object.get('seller'));
					purchases.set("total", object.get('total'));
					purchases.set("books", object.get('books'));
          purchases.set("status", "Paid");
					purchases.save(null, {
						success: function(purchase) {
							// deactivate books for sell
							listingQuery.equalTo("ISBN", object.get('books')[0]);
							listingQuery.equalTo("activeStatus", "active");
							listingQuery.find({
								success: function(results) {
									if (results.length > 0) {
											results[0].set("activeStatus", "Sold");
											results[0].save(null, results[0]);
									}
									object.destroy({
									  success: function(myObject) {
										res.render('purchased', { message: undefined, user: user });
									  },
									  error: function(myObject, error) {
										// The delete failed.
										// error is a Parse.Error with an error code and message.
									  }
									});
								}
							});
						},
						error: function(purchase, error) {
							// Execute any logic that should take place if the save fails.
							res.render('purchased', { message: req.params, user: user });
						}
					});
				} else {
					res.render('purchased', { message: "Try adding items to cart and complete purchase with PayPal !!!", user: user });
				}
			},
		  error: function(error) {
		  	res.render('purchased', { message: error, user: user });
		  }
		});
	} else
		res.render('purchased', { message: req.params, user: user });
});

app.post('/contact', function(req, res) {
	var name = req.body.user_name;
	var email = req.body.user_email;
	var inquiry = req.body.inquiry;

Mandrill.sendEmail({
  message: {
    text: inquiry,
    subject: "Website Inquiry",
    from_email: email,
    from_name: name,
    to: [
      {
        email: "jpinottz@spsu.edu",
        name: "Capstone"
      }
    ]
  },
  async: true
},{
  success: function(httpResponse) {
    console.log(httpResponse);
    res.render('contacted');
  },
  error: function(httpResponse) {
    console.error(httpResponse);
    response.error("Uh oh, something went wrong");
  }
});

});

app.post('/resetPassword', function(req, res){
	var email = req.body.email;

	Parse.User.requestPasswordReset(email, {
	  success: function() {
	  	res.render('resetPassword', {message: "A password reset link has been sent to the email listed."});
	  },
	  error: function(error) {
	  	res.render('resetPassword', {message: "The Email address you entered was not found."});
	  }
	});

});

app.post('/sellBook', function(req, res){

	var user = Parse.User.current();
	var title = req.body.bookTitle;
	var author = req.body.bookAuthor;
	var isbn = req.body.isbn;
	var condition = req.body.conditionSelect;
	var description = req.body.bookDescription;
	var price = req.body.bookPrice;
  price = price.replace(/[$,]/g, '');
  //var num = Number(price);
	var quantity = req.body.bookQuantity;

  if(title === "" || title === undefined){
    res.render('sellBook', {user: user, message: undefined, error1: "All fields are required!"});
  }


	var Books = Parse.Object.extend("Books");
	var query = new Parse.Query(Books);

	var BookListings = Parse.Object.extend("BookListings");
	var bookListing = new BookListings();


	query.contains("ISBN", isbn);

	query.find({
	  success: function(results) {
	  	if(results.length > 0){
  			bookListing.set('Title', title);
  			bookListing.set('Author', author);
  			bookListing.set('ISBN', isbn);
  			bookListing.set('Condition', condition);
  			bookListing.set('Description', description);
  			bookListing.set('Quantity', quantity);
  			bookListing.set('Seller', user.get('username'));
  			bookListing.set('Price', price);
        bookListing.set('activeStatus', "active");
  			bookListing.save(null, bookListing);

		      var bookListing2 = Parse.Object.extend("BookListings");
			  var query2 = new Parse.Query(bookListing2);
			  var books = [];

			  query2.contains("Seller", user.get('username'));

			  query2.find({
			  	success: function(results) {
			  		if(results.length > 0) {
			  			for(var i = 0; i < results.length; i++){
			  				books[i] = results[i].toJSON();
			  			}
			  			res.render('sellersListings', {user: user, books: books})
			  		}
			  	},
				   error: function(error){
				   	//res.render('index', {user: user});
				   }
	  			});
			}
	  	else{
	  		var book = new Books();
	  		book.set('Author', author);
	  		book.set('Title', title);
	  		book.set('ISBN', isbn);
	  		book.save(null, book);

  			bookListing.set('Title', title);
  			bookListing.set('Author', author);
  			bookListing.set('ISBN', isbn);
  			bookListing.set('Condition', condition);
  			bookListing.set('Description', description);
  			bookListing.set('Quantity', quantity);
  			bookListing.set('Seller', user.get('username'));
  			bookListing.set('Price', price);
        bookListing.set('activeStatus', "active");
  			bookListing.save(null, bookListing);

		      var bookListing2 = Parse.Object.extend("BookListings");
			  var query2 = new Parse.Query(bookListing2);
			  var books = [];

			  query2.contains("Seller", user.get('username'));

			  query2.find({
			  	success: function(results) {
			  		if(results.length > 0) {
			  			for(var i = 0; i < results.length; i++){
			  				books[i] = results[i].toJSON();
			  			}
			  			res.render('sellersListings', {user: user, books: books})
			  		}
			  	},
				   error: function(error){
				   	//res.render('index', {user: user});
				   }
	  			});
			}

	   },
	   error: function(error){
	   	//res.render('index', {user: user});
	   }
	});
});

app.get('*', function(req, res) {
  res.redirect('/');
});


app.post('/addPayPalAccount', function(req, res){

  var user = Parse.User.current();
  var email = req.body.PayPalEmail;
  var emailVerify = req.body.PayPalEmailVerify;
  var atpos = email.indexOf('@');
	var dotpos = email.lastIndexOf('.');

  if(email == null || email == ''){
    errorMessage = 'Email address must be filled out';
    res.render('addPayPalAccount', {user: user, message: undefined, error1: errorMessage});
    return;
  }
  else if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		errorMessage = 'Not a valid e-mail address';
		res.render('addPayPalAccount', {user: user, message: undefined, error1: errorMessage});
		return;
  }
  else if(emailVerify == null || emailVerify == '' || emailVerify != email){
    errorMessage = 'Email addresses must match';
    res.render('addPayPalAccount', {user: user, message: undefined, error1: errorMessage});
    return;
  }

  user.set("PayPalEmailAddress", email);

  if(user.get('addressLine1') !== undefined){
    user.set('userType', "Buyer and Seller");
        user.save(null, user);
        res.render('userProfile', { user: user });
  }
  else{
    user.save(null, user);
    res.render('userProfile', { user: user });
  }
});

app.post('/removePayPalEmail', function(req, res){
  var user = Parse.User.current();
  user.set("userType", "Buyer");
  user.set("PayPalEmailAddress", undefined);
  user.save(null, user);

  res.render('userProfile', {user: user});
});

app.post('/manageSellerInventory', function(req, res){
  var user = Parse.User.current();
  //var text = req.body.activeListingStatus2;

  var bookListing = Parse.Object.extend("BookListings");
  var query = new Parse.Query(bookListing);
  var query2 = new Parse.Query(bookListing);
  var books = [];
  var booksInactive = [];
  var count = 0;

  query.ascending("objectId");
  query.contains("Seller", user.get('username'));
  query.find({
    success: function(results) {
      count = (results.length);
      for(var i = 0; i < count ; i++){
        var objectId = results[i].toJSON().objectId;
        var temp = results[i];
        var text = req.body['listingStatus' + objectId];
        temp.set("activeStatus", text);
        temp.save(null, temp);
      }
      res.render('userProfile', {user: user});
    },
     error: function(error){
       res.render('index', {user: user});
     }
  });

});

app.post('/manageOrders', function(req, res){
  var user = Parse.User.current();
  //var text = req.body.activeListingStatus2;

  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var count = 0;
  var tempArray = [];

  query.ascending("objectId");
  query.contains("seller", user.get('username'));
  query.find({
    success: function(results) {
      count = (results.length);
      for(var i = 0; i < count ; i++){
      var objectId = results[i].toJSON().objectId;
      var temp = results[i];
      var text = req.body['listingStatus' + objectId];
      if(text === "yes"){
        temp.set("status", "Shipped");
        temp.set("shippedDate", new Date());
        temp.save(null, temp);
      }

      }
      res.render('userProfile', {user: user});
    },
     error: function(error){
       res.render('index', {user: user});
     }
  });

});


app.post('/buyerFeedback/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var Feedback = Parse.Object.extend("Feedback");
  var feedback = new Feedback();

  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var temp = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        temp = results[0].toJSON();
        results[0].set('hasBuyerFeedback', true);
        results[0].save(null, results);
        feedback.set('userRated', temp.buyer);
        feedback.set('ratingUser', temp.seller);
        feedback.set('comments', req.body.comments);
        feedback.set('rating', req.body.Rating);
        feedback.set('transactionId', req.params.id);
        feedback.save(null, feedback);
      }
      res.render('userProfile', {user: user, message: undefined, error1: undefined});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }


});

});


app.post('/sellerFeedback/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var Feedback = Parse.Object.extend("Feedback");
  var feedback = new Feedback();

  var purchases = Parse.Object.extend("Purchases");
  var query = new Parse.Query(purchases);
  var temp = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        temp = results[0].toJSON();
        results[0].set('hasSellerFeedback', true);
        results[0].save(null, results);
        feedback.set('userRated', temp.seller);
        feedback.set('ratingUser', temp.buyer);
        feedback.set('comments', req.body.comments);
        feedback.set('rating', req.body.Rating);
        feedback.set('transactionId', req.params.id);
        feedback.save(null, feedback);
      }
      res.render('userProfile', {user: user});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }


});

});

app.post('/sellThisBook/:id?/:op?', function(req, res) {

  if( Parse.User.current()) {
    var user = Parse.User.current();
  } else{
    var user = undefined;
  }

  var book = Parse.Object.extend("Books");
  var query = new Parse.Query(book);

  var BookListings = Parse.Object.extend("BookListings");
  var bookListing = new BookListings();

  var condition = req.body.conditionSelect;
  var description = req.body.bookDescription;
  var price = req.body.bookPrice;
  price = price.replace(/[$,]/g, '');
  var quantity = req.body.bookQuantity;
  var temp = undefined;

  query.equalTo("objectId", req.params.id);
  query.find({
    success: function(results) {
      if (results.length > 0) {
        temp = results[0].toJSON();
        bookListing.set('Title', temp.Title);
        bookListing.set('Author', temp.Author);
        bookListing.set('ISBN', temp.ISBN);
        bookListing.set('Condition', condition);
        bookListing.set('Description', description);
        bookListing.set('Quantity', quantity);
        bookListing.set('Seller', user.get('username'));
        bookListing.set('Price', price);
        bookListing.set('activeStatus', "active");
        bookListing.save(null, bookListing);
      }
      res.render('userProfile', {user: user});
    },
    error: function(error){
      //res.render('buyerFeedback', {user: user, buyerInfo: buyerInfo});
    }


});

});


// Attach the Express app to Cloud Code.
app.listen();
