var express = require('express');
var router = express.Router();

// Renders registration page
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

// Renders login page
router.get('/login', function(req, res, next) {
  res.render('users/login');
});

module.exports = router;
