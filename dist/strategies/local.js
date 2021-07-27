"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
// Passport login auth
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password, user.hashedPassword, (error, res) => {
            if (res) {
                return done(null, user, { message: 'Logged in successfully.' });
            }
            return done(null, false, { message: 'Incorrect password.' });
        });
    });
}));
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, function (jwtPayload, cb) {
    // Find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findOneById(jwtPayload.id)
        .then((user) => {
        return cb(null, user);
    })
        .catch((err) => {
        return cb(err);
    });
}));
//# sourceMappingURL=local.js.map