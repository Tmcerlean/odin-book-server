export {};

const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwtToken = require("passport-jwt").ExtractJwt;
const User = require("../models/user");

interface JWTOptions {
    jwtFromRequest?: Function
    secretOrKey?: String
}

const opts: JWTOptions = {};
opts.jwtFromRequest = ExtractJwtToken.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

module.exports = new JwtStrategy(opts, function (jwt_payload: any, done: Function) {
    User.findOne({ _id: jwt_payload.id }, function (err: Error, user: Express.User) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
});