export {};

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// Passport login auth
passport.use(new LocalStrategy((username: any, password: string, done: Function) => {
    User.findOne({ username }, (err: Error, user: any) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        bcrypt.compare(password, user.hashedPassword, (error: Error, res: Express.Response) => {
            if (res) {
                return done(null, user, { message: 'Logged in successfully.'});
            }
            return done(null, false, { message: 'Incorrect password.' });
        });
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
},
function (jwtPayload: any, cb: Function) {

    // Find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return User.findOneById(jwtPayload.id)
        .then((user: any) => {
            return cb(null, user);
        })
        .catch((err: Error) => {
            return cb(err);
        });
}
));