var express = require('express'); //import express
var app = express();
var firebase = require('firebase');
var bodyParser = require('body-parser');
var config = {
  apiKey: "AIzaSyDv2kxOjJ7SCWa9P8ITE2o0LyKq1Xk6Q18",
  authDomain: "ecommerce-fae97.firebaseapp.com",
  databaseURL: "https://ecommerce-fae97.firebaseio.com",
  projectId: "ecommerce-fae97",
  storageBucket: "ecommerce-fae97.appspot.com",
  messagingSenderId: "678299482970",
  appId: "1:678299482970:web:f365dcb60cc9fb77"
};

firebase.initializeApp(config);
app.use(bodyParser.json()); //need to parse HTTP request body
app.use(bodyParser.urlencoded({extended: true}));


//Get all instances
app.get('/users', function (req, res) {

	console.log("HTTP Get Request");
	var userReference = firebase.database().ref("/Users/");
  //var value = req.param.id;

	//Attach an asynchronous callback to read the data
	userReference.on("value",
			  function(snapshot) {
					console.log(snapshot.val());
					res.json(snapshot.val());
					userReference.off("value");
					},
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

//Get user instance
app.get('/:id', function (req, res) {

	console.log("HTTP Get/:id Request");
	var phone = req.params.id;
  console.log(phone);
  var userReferencePath = '/Users/'+phone+'/';
  var adminReferencePath = '/Admins/'+phone+'/';
  var userReference = firebase.database().ref(userReferencePath);
  var adminReference = firebase.database().ref(adminReferencePath);





	//Attach an asynchronous callback to read the data
	adminReference.on("value",
			  function(snapshot) {
					console.log(snapshot.val());
          if(snapshot.val() == null)
          {

            userReference.on("value",
              function(snapshot) {
                if(snapshot.val() == null){
                  var s = "user not found";
                  res.send(s);
                  //console.log(snapshot.val());
                }
                else {
                  res.json(snapshot.val());
        					adminReference.off("value");
                }

              })
          }
          else {
            //res.send(snapshot.val());
            res.json(snapshot.val());
  					userReference.off("value");
          }

					},
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

//Create new instance
app.post('/', function (req, res) {

	console.log("HTTP Put Request");
  //console.log(req.body);

	var name = req.body.name;
	var phone = req.body.phone;
	var password = req.body.password;
  var image = "";
  var address = "";
console.log( req.body);
	var referencePath = '/Users/'+phone+'/';
	var userReference = firebase.database().ref(referencePath);


	userReference.set({name: name, password: password, phone: phone, image:image,address:address},
				 function(error) {
					if (error) {
						res.send("Data could not be saved." + error);
					}
					else {
						res.send("Data saved successfully.");
					}
			});
});

//Update existing instance
app.patch('/', function (req, res) {

	console.log("HTTP POST Request");

	var userName = req.body.UserName;
	var name = req.body.Name;
	var age = req.body.Age;

	var referencePath = '/Users/'+userName+'/';
	var userReference = firebase.database().ref(referencePath);
	userReference.update({Name: name, Age: age},
				 function(error) {
					if (error) {
						res.send("Data could not be updated." + error);
					}
					else {
						res.send("Data updated successfully.");
					}
			    });
});


//Delete an instance
app.delete('/:id', function (req, res) {

   console.log("HTTP DELETE Request");
   //todo
   var userName = req.params.id;
   var referencePath = '/Users/'+userName+'/';
   var userReference = firebase.database().ref(referencePath);


   var referencePath = '/Users/'+userName+'/';
 	var userReference = firebase.database().ref(referencePath);
 	userReference.remove(
 				 function(error) {
 					if (error) {
 						res.send("Data could not be deleted." + error);
 					}
 					else {
 						res.send("Data deleted successfully.");
 					}
 			    });

});


//Create new cartProduct
app.post('/cartList', function (req, res) {


//   var db = firebase.database();
// var ref = db.ref("New Admin");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });
//
// var usersRef = ref.child("newusers");
// usersRef.set({
//   alanisawesome: {
//     date_of_birth: "June 23, 1912",
//     full_name: "Alan Turing"
//   },
//   gracehop: {
//     date_of_birth: "December 9, 1906",
//     full_name: "Grace Hopper"
//   }
// });
	console.log("HTTP Post cartList Request");
  //console.log(req.body);
var product = {
   pid: req.body.pid,
	pname: req.body.pname,
	 price : req.body.price,
   date : req.body.date,
   time : req.body.time,
   quantity : req.body.quantity,
  discount : req.body.discount,
  phone: req.body.phone
}

console.log( req.body);
	var userReferencePath = '/Cart List/User View/'+product.phone+'/Products/'+product.pid+'/';
  var adminReferencePath = '/Cart List/Admin View/'+product.phone+'/Products/'+product.pid+'/';

  var db = firebase.database();
  var userReference = db.ref(userReferencePath);
  userReference.once("value", function(snapshot) {
    console.log(snapshot.val());
  });
  var adminReference = db.ref(adminReferencePath);
  adminReference.once("value", function(snapshot) {
    console.log(snapshot.val());
  });
  // var userReference = firebase.database().ref(userReferencePath);
  // var adminReference = firebase.database().ref(adminReferencePath);


  // adminReferencePath.once("value", function(snapshot) {
  //   console.log(snapshot.val());
  // });


	userReference.set(product,
				 function(error) {
					if (error) {
						res.send("Data could not be saved.");
					}
					else {
            adminReference.set(product,
              function(error){
                if (error) {
      						res.send("Data could not be saved.");
      					}
              })
						res.send("Data saved successfully.");
					}
			});
});


//Create new Product
app.post('/products', function (req, res) {
  console.log("HTTP Post new Product Request");
  //console.log(req.body);
var product = {
   pid: req.body.pid,
   description: req.body.description,
   image: req.body.image,
   category: req.body.category,
	 pname: req.body.pname,
	 price : req.body.price,
   date : req.body.date,
   time : req.body.time,
   key: req.body.key
}

console.log( req.body);
	var productReferencePath = '/Products/'+product.key+'/';

  var db = firebase.database();
  var productReference = db.ref(productReferencePath);
  productReference.once("value", function(snapshot) {
    console.log(snapshot.val());
  });

	productReference.set(product,
				 function(error) {
					if (error) {
						res.send("Product could not be saved.");
					}
					else {
						res.send("Product saved successfully.");
					}
			});
});

//Get user instance
app.get('/product/:id', function (req, res) {

	console.log("HTTP Get/:id Request");
	var id = req.params.id;
  var productReferencePath = '/Products/'+id+'/';
  var productReference = firebase.database().ref(productReferencePath);

	productReference.on("value",
			  function(snapshot) {
					console.log(snapshot.val());
          if(snapshot.val() == null)
          {
            var s = "product not found";
            res.send(s);
          }
          else {
            //res.send(snapshot.val());
            res.json(snapshot.val());
  					productReference.off("value");
          }

					},
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});

//Delete a Product
app.delete('/product/:id', function (req, res) {

   console.log("HTTP DELETE Request");

   var id = req.params.id;
   console.log(id);
   var referencePath = '/Products/'+id+'/';
  var productReference = firebase.database().ref(referencePath);

 	productReference.remove(
 				 function(error) {
 					if (error) {
 						res.send("Product cannot not be deleted." + error);
 					}
 					else {
 						res.send("Data deleted successfully.");
 					}
 			    });

});

//Update a Product
app.patch('/product/:id', function (req, res) {

	console.log("HTTP UPDATE Request");
  var pid =  req.body.pid;
  var product = {
    description: req.body.description,
 	  pname: req.body.pname,
 	  price : req.body.price,
  }

  var id = req.params.id;
  var referencePath = '/Products/'+pid+'/';
 var productReference = firebase.database().ref(referencePath);

 productReference.update(product,
        function(error) {
         if (error) {
           res.send("Product cannot not be updated." + error);
         }
         else {
           res.send("Product updated successfully.");
         }
         });
});







//Create new Order
app.post('/Orders', function (req, res) {
  console.log("HTTP Post new Product Request");
  //console.log(req.body);
var order = {
   totalAmount: req.body.totalAmount,
   name: req.body.name,
   phone: req.body.phone,
   address: req.body.address,
	 city: req.body.city,
	 date : req.body.date,
   time:req.body.time,
   state : "Not shipped",
   userPhone: req.body.userPhone
}

console.log( req.body);
	var orderReferencePath = '/Orders/'+order.userPhone+'/';

  var db = firebase.database();
  var orderReference = db.ref(orderReferencePath);
  orderReference.once("value", function(snapshot) {
    console.log(snapshot.val());
  });

	orderReference.set(order,
				 function(error) {
					if (error) {
						res.send("Order could not be saved.");
					}
					else {
						res.send("Order saved successfully.");
					}
			});
});

//Get order instance
app.get('/order/:id', function (req, res) {

	console.log("HTTP Get/:id Request");
	var id = req.params.id;
  var orderReferencePath = '/Orders/'+id+'/';
  var orderReference = firebase.database().ref(orderReferencePath);

	orderReference.on("value",
			  function(snapshot) {
					console.log(snapshot.val());
          if(snapshot.val() == null)
          {
            var s = "order not found";
            res.send(s);
          }
          else {
            //res.send(snapshot.val());
            res.json(snapshot.val());
  					orderReference.off("value");
          }

					},
			  function (errorObject) {
					console.log("The read failed: " + errorObject.code);
					res.send("The read failed: " + errorObject.code);
			 });
});










//start server on port: 8080
var server = app.listen(3000, function () {

  //var host = server.address().address;
  var port = server.address().port;

  console.log("server listening at http://%s", port);
});
