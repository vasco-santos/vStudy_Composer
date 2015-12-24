/**
Aveiro University
MIECT - Services Engineering
    
    @author: Vasco Santos (64191)

Service Composition for vStudy Application
*/

/**
Server built using NodeJS
*/

/**
Lode Models to use
    . Express
    . Path
    . Favicon
    . Logger
    . CookieParser
    . BodyParser
    . Session
    . Passport
*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

//Mongoose - Initialize mongoose schemas
require('./models/subjectModel');
require('./models/courseModel');
require('./models/userModel');
require('./models/tableModel');
var mongoose = require('mongoose');                         //add for Mongo support
mongoose.connect("mongodb://localhost:27017/vStudy");              //connect to Mongo

// Start Express routing middleware
var coursesAPI = require('./routes/coursesAPI');
//var repositoryAPI = require ('./routes/repositoryAPI');
var tablesAPI = require('./routes/tablesAPI');
var authenticationAPI = require('./routes/authenticationAPI')(passport);
var storageAPI = require('./routes/storageAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Mount Middleware functions
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Middleware routing bind
app.use('/authenticationAPI', authenticationAPI);
app.use('/coursesAPI', coursesAPI);
//app.use('/repositoryAPI', repositoryAPI);
app.use('/tablesAPI', tablesAPI);
app.use('/storageAPI', storageAPI);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Initialize Passport Package
var initPassport = require('./passport-init');
initPassport(passport);


/**
    Error handlers
*/

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;