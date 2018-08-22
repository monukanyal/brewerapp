// server.js

// BASIC SETUP
// =============================================================================

// Call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var ev = require('express-validation');
var db = require(__dirname + '/models/index');

// Sync the database models
db.sequelize.sync({
  // force: true
});

// Create an express app
var app = express();

// CORS Settings
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Angular DIST output folder
app.use(express.static(path.join(__dirname, '../client/dist/client')));
app.use('/static', express.static(path.join(__dirname, 'public')))
//app.use(express.static(__dirname + '/client/dist'));

// Configure the app to use bodyParser()
// This will let us get the data from post
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================

var Userrouter = require('./routers/User');
var Brewerrouter = require('./routers/Brewer');
var router = express.Router();

// All of our routes will console log a status
app.use(function (req, res, next) {
  console.log('==========================================');
  console.log(req.method + ': ' + req.url);
  next();
});

// Ideally, this route sends the index.html
router.get('/', function (req, res) {

  res.json({
    message: 'Brew Pub App Server!'
  });
});


app.use('/api/User', Userrouter);
app.use('/api/Brewer', Brewerrouter);
// app.use('api/stores', storesRouter);

app.use('/api', router);
// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/client/index.html'));
});
// error handler
app.use(function (err, req, res, next) {
  // specific for validation errors
  if (err instanceof ev.ValidationError) return res.status(err.status).json(err);
 
  // other type of errors, it *might* also be a Runtime Error
  // example handling
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json(err.stack);
  } else {
    return res.status(500);
  }
});

module.exports = app;