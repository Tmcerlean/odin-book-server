import Mongoose from 'mongoose';

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

interface User {
    _id: Mongoose.Types._ObjectId
    posts: String[]
    friends: String[]
    friendRequests: String[]
    firstName: String
    lastName: String
    email: String
    hashedPassword: String
    __v: Number
}

// JSON Web Token Generation

const issueJWT = (user: User) => {
  const _id = user._id;
  const expiresIn = "1d";

  const payload = {
    id: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

// Password Generation

const generatePassword = (password: String) => {
  return bcrypt.hashSync(password, 10);
};

const validatePassword = (password: String, user: User) => {
  return bcrypt.compare(password, user.hashedPassword);
};

module.exports.issueJWT = issueJWT;
module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;