export {};

const passport = require("passport");
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../models/user");

interface FacebookPhotosObject extends Object {
  value: String
}

interface FacebookProfileObject extends Object {
  id: String,
  photos: FacebookPhotosObject[]
  _json: {
    first_name: String
    last_name: String
    email: String
  }
}

interface PassportUserObject extends Express.User {
  _id: String
}

module.exports = new FacebookTokenStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    fbGraphVersion: "v3.0",
  },
  function (accessToken: String, refreshToken: String, profile: FacebookProfileObject, done: Function) {
    User.findOrCreate(
      { facebookId: profile.id },
      {
        firstName: profile._json.first_name,
        lastName: profile._json.last_name,
        email: profile._json.email,
        profileImageUrl: profile.photos[0].value,
      },
      function (error: Error, user: Express.User) {
        return done(error, user);
      }
    );
  }
);

passport.serializeUser(function (user: PassportUserObject, done: Function) {
  done(null, user._id);
});

passport.deserializeUser(function (id: String, done: Function) {
  User.findById(id, function (err: Error, user: PassportUserObject) {
    done(err, user);
  });
}); 