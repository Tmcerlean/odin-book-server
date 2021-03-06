// Imports
import express, { NextFunction, Request, Response } from 'express';
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session')
const passport = require("passport");

// Type information
interface ErrorInfo extends Error {
  status: number
}

// Initialise dotenv
require('dotenv').config()

// Import Passport Strategies (after initialising dotenv environment variables)
const jwtStrategy = require("./strategies/jwt");
const facebookStrategy = require("./strategies/facebook");

// Define main app
const app = express();

// CORS setup
app.use(cors())

// Module dependencies
const debug = require('debug')('blog:server');
const http = require('http');

// Get port from environment and store in Express
const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
 
// Create HTTP server 
const server = http.createServer(app);
 
// Listen on provided port, on all network interfaces
server.listen(port, () => console.log(`Running on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);
 
// Normalize a port into a number, string, or false
function normalizePort(val: string) {
  var port = parseInt(val, 10);
 
  if (isNaN(port)) {
    // Named pipe
    return val;
  }
 
  if (port >= 0) {
    // Port number
    return port;
  }
 
  return false;
}
 
// Event listener for HTTP server "error" event
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
 
  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
     throw error;
  }
}
 
// Event listener for HTTP server "listening" event
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
 
// Add middleware libraries
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// Add Passport strategy middleware
passport.use(facebookStrategy);
passport.use(jwtStrategy);

// Require index router
const indexRouter = require("./routes/index");
const test = require('./routes/test');    // DELETE

// Add router to request handling chain
app.use('/api', indexRouter);
app.use('/test', passport.authenticate('jwt', {session: false}), test);    // DELETE

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err: ErrorInfo, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(`${err.status} error`);
});

module.exports = app;