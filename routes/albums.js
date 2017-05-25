var express = require('express');
var router = express.Router();

// Multer (file uploading)
var multer = require('multer');
var upload = multer({ dest: './public/img/uploads'})

// Firebase module
var firebase = require('firebase');

// Show Albums
router.get('/', function(req, res, next) {

  // Fetch Genres from db
  var albumRef = firebase.database().ref('albums');

  // Read collection
  albumRef.once('value', function(snapshot) {

    var albums = [];

    snapshot.forEach(function(data) {

      albums.push({
        id     : data.key,
        artist : data.val().artist,
        title  : data.val().title,
        genre  : data.val().genre,
        info   : data.val().info,
        label  : data.val().label,
        tracks : data.val().tracks,
        cover  : data.val().cover
      });

    });

    res.render('albums/index', {albums: albums});

  });
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

// Displays specif album
router.get("/details/:id", function(req, res) {

  // Get id
  var id = req.params.id;

  // Fetch album with same id
  var albumRef = firebase.database().ref('albums/' + id);
  albumRef.once('value', function(snapshot){
    var album = snapshot.val();
    res.render('albums/details', { album: album, id: id });
  });


});

// Edit album
router.get('/edit/:id', function(req, res, next) {

  // Get id
  var id = req.params.id;

  // DB reference to genres collection
  var genreRef = firebase.database().ref('genres');

  // Fetch genre with given id
  var albumRef = firebase.database().ref('albums/' + id);

  // Read collection
  genreRef.once('value', function(snapshot) {

    var genres = [];

    snapshot.forEach(function(data) {

      genres.push({
        id: data.key,
        name: data.val().name
      });

    });

    albumRef.once('value', function(snapshot) {
      var album = snapshot.val();
      res.render('albums/edit', { album: album, id: id, genres: genres });
    });

  });

});

// Edit album
router.post('/edit/:id', upload.single('cover'), function(req, res, next) {

  // Get id
  var id = req.params.id;

  // Fetch genre with given id
  var albumRef = firebase.database().ref('albums/' + id);

  // Check for file (Uploaded)
  if (req.file) {
    var cover = req.file.filename;

    // Edit with cover
    albumRef.update({
      artist : req.body.artist,
      title  : req.body.title,
      genre  : req.body.genre,
      info   : req.body.info,
      year   : req.body.year,
      label  : req.body.label,
      tracks : req.body.tracks,
      cover  : cover
    });

  }
  else {
    // Edit without cover
    albumRef.update({
      artist : req.body.artist,
      title  : req.body.title,
      genre  : req.body.genre,
      info   : req.body.info,
      year   : req.body.year,
      label  : req.body.label,
      tracks : req.body.tracks
    });
  }

  // Message + redirection
  req.flash('success_msg', 'Album Saved');
  res.redirect('/albums');

});

module.exports = router;
