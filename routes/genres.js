var express = require('express');
var router  = express.Router();

// Firebase module
var firebase = require('firebase');

// Shows Genres
router.get('/', function(req, res, next) {

  // Fetch Genres from db
  var genreRef = firebase.database().ref('genres');

  // Read collection
  genreRef.once('value', function(snapshot) {

    var genres = [];

    snapshot.forEach(function(data) {

      genres.push({
        id: data.key,
        name: data.val().name
      });

    });

    res.render('genres/index', {genres: genres});

  });

});

// Add Genre View
router.get('/add', function(req, res, next) {
  res.render('genres/add');
});

// Handlers Genre Add
router.post('/add', function(req, res, next) {

  // Genre object
  var genre = {
    name: req.body.name
  }

  // Push objec to our collection
  var genreRef = firebase.database().ref('genres');
  genreRef.push(genre);

  // Display flash message and redirects
  // to homebase.
  req.flash('success_msg', "Genre Saved");
  res.redirect('/genres');

});

module.exports = router;
