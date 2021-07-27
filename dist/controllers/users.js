"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { issueJWT, generatePassword, validatePassword, } = require("../utils/auth-utils");
// POST signup
exports.signup_post = [
    // Validate and sanitize fields
    express_validator_1.body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name contains non-alphanumeric characters'),
    express_validator_1.body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified')
        .isAlphanumeric().withMessage('Last name contains non-alphanumeric characters'),
    express_validator_1.body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
    express_validator_1.body("password").isLength({ min: 6 }).withMessage("Password must contain at least 6 characters"),
    // Process request after validation and sanitization.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // Data from form is valid.
        const hashedPassword = generatePassword(req.body.password);
        // Otherwise, store hashedPassword in DB
        const user = new User({
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email,
            hashedPassword: hashedPassword
        });
        try {
            yield user.save();
            const tokenObject = issueJWT(user);
            return res.status(200).json({
                message: "User signed up successfully",
                token: tokenObject,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user._id,
                    profileImageUrl: user.profileImageUrl ? user.profileImageUrl : ""
                }
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    })
];
// POST login
exports.login_post = [
    express_validator_1.body("email", "Email required").trim().isEmail().escape(),
    express_validator_1.body("password", "Password required").trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.status(400).json({
                errors: errors.array()
            });
        }
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (!user) {
                return res.status(400).json({
                    message: 'No user with those credentials',
                    user: user
                });
            }
            if (err) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (err) => {
                if (err) {
                    res.send(err);
                }
                // Generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(user, 'supersecret');
                return res.status(200).json({
                    message: "User logged in successfully",
                    token,
                    user
                });
            });
        })(req, res);
    })
];
//# sourceMappingURL=users.js.map