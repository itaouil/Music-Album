var express = require('express');
var router = express.Router();

// Multer (file uploading)
var multer = require('multer');
var upload = multer({ dest: './public/img/uploads'})

// Firebase module
var firebase = require('firebase');

// Show Albums
router.get('/', function(req, res, next) {
  res.render('albums/index');
});

// Show Album's add form
router.get('/add', function(req, res, next) {

  // DB reference to genres collection
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

    res.render('albums/add', {genres: genres});

  });

});

// Handles the add feature for albums
router.post('/add', upload.single('cover'), function(req, res, next) {

  // Check for file (Uploaded)
  if (req.file) {
    var cover = req.file.filename;
  }
  else {
    var cover = 'noImage.jpg';
  }

  // Album Object
  var album = {
    artist : req.body.artist,
    title  : req.body.title,
    genre  : req.body.genre,
    info   : req.body.info,
    year   : req.body.year,
    label  : req.body.label,
    tracks : req.body.tracks,
    cover  : cover
  };

  // Push album to db
  var albumRef = firebase.database().ref('albums');
  albumRef.push(album);

  // Message + redirection
  req.flash('success_msg', 'Album Saved');
  res.redirect('/albums');

});

module.exports = router;
