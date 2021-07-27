import Mongoose from 'mongoose';

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

interface User extends Express.User {
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

// Password Hash Generation
const generatePassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

// Password Hash Validation
const validatePassword = (password: string, user: User) => {
  return bcrypt.compare(password, user.hashedPassword);
};

module.exports.issueJWT = issueJWT;
module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;