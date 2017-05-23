// Modules
var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var flash        = require('connect-flash');
var brcyptjs     = require('bcryptjs');
var validator    = require('express-validator');
var session      = require('express-session');

// Firebase Modules
var firebase = require('firebase');
var frConfig = require('./config/config');

// Firebase reference
firebase.initializeApp(frConfig);

// Routes modules
var index  = require('./routes/index');
var users  = require('./routes/users');
var albums = require('./routes/albums');
var genres = require('./routes/genres');

// Express instance
var app = express();

// Engine's view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Validator middleware
app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Session middleware
app.use(session({
  secret: 'curl http://hack.me.com.2',
  resave: false,
  saveUninitialized: true
}));

// Flash messages middleware
app.use(flash());

// Globals
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes middleware
app.use('/', index);
app.use('/users', users);
app.use('/albums', albums);
app.use('/genres', genres);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
