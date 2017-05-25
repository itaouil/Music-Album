var express = require('express');
var router = express.Router();

// Firebase module
var firebase = require('firebase');

// Renders registration page
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

// Handles Registration
router.post('/register', function(req, res, next) {

  // Body attributes
  var first_name = req.body.first_name;
  var last_name  = req.body.last_name;
  var email      = req.body.email;
  var password   = req.body.password;
  var password2  = req.body.password2;

  // Validation
  req.checkBody('first_name', 'First name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Validation errors
  var errors = req.validationErrors();

  if (errors) {
    // Render errors
    res.render('users/register', {
      errors: errors
    });
  }

  else {
    // firebase.createUser({
    //   email    : email,
    //   password : password
    // }, function(err, userData){
    //   if (err) {
    //     console.log("Error creating user: ", err);
    //   }
    //   else {
    //     console.log("Successfully created user with uid: ", userData.uid);
    //     var user = {
    //       uid: userData.uid,
    //       email: email,
    //       first_name: first_name,
    //       last_name: last_name
    //     }
    //
    //     var userRef = firebase.database().ref('users');
    //     userRef.push(user);
    //
    //     req.flash('success_msg', 'You are now registered and can login');
    //     res.redirect('/users/login');
    //   }
    // });

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {

      // Handle Errors
      if (error) {
        res.render('users/register', {authError: error.message});
      }

      else {
        // All good
        console.log("Successfully created user");
      }

    });

  }

});

// Renders login page
router.get('/login', function(req, res, next) {
  res.render('users/login');
});

module.exports = router;
