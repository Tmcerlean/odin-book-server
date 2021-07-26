"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwtToken = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const opts = {};
opts.jwtFromRequest = ExtractJwtToken.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";
module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
            // Or you could create a new account
        }
    });
});
//# sourceMappingURL=jwt.js.map