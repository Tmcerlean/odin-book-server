"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// JSON Web Token Generation
const issueJWT = (user) => {
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
const generatePassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
// Password Hash Validation
const validatePassword = (password, user) => {
    return bcrypt.compare(password, user.hashedPassword);
};
module.exports.issueJWT = issueJWT;
module.exports.generatePassword = generatePassword;
module.exports.validatePassword = validatePassword;
//# sourceMappingURL=auth-utils.js.map