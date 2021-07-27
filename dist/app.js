"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const express_1 = __importDefault(require("express"));
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require("passport");
// Initialise dotenv
require('dotenv').config();
const app = express_1.default();
const localStrategy = require('./strategies/local');
const jwtStrategy = require("./strategies/jwt");
const facebookTokenStrategy = require("./strategies/facebook");
// CORS setup
app.use(cors());
// Module dependencies
var debug = require('debug')('blog:server');
var http = require('http');
// Get port from environment and store in Express
var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);
// Create HTTP server 
var server = http.createServer(app);
// Listen on provided port, on all network interfaces
server.listen(port, () => console.log(`Running on port ${port}`));
server.on('error', onError);
server.on('listening', onListening);
// Normalize a port into a number, string, or false
function normalizePort(val) {
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
function onError(error) {
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
// Routes
const apiRouter = require('./routes/api');
const test = require('./routes/test');
// Add middleware libraries
app.use(logger('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_1.default.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
// Add Passport strategy middleware
passport.use(jwtStrategy);
passport.use(facebookTokenStrategy);
// Add router to request handling chain
app.use('/api', apiRouter);
app.use('/test', passport.authenticate('jwt', { session: false }), test);
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.json(`${err.status} error`);
});
module.exports = app;
//# sourceMappingURL=app.js.map