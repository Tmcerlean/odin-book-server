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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const User = require('../models/user');
const { issueJWT, generatePassword, validatePassword, } = require('../utils/auth-utils');
// POST signup
exports.signup_post = [
    // Validate and sanitize fields
    express_validator_1.body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name contains non-alphanumeric characters.'),
    express_validator_1.body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Last name contains non-alphanumeric characters.'),
    express_validator_1.body('email').isEmail().withMessage('Please enter a valid email address.'),
    express_validator_1.body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.'),
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
                message: 'User signed up successfully.',
                token: tokenObject,
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    id: user._id,
                    profileImageUrl: user.profileImageUrl ? user.profileImageUrl : ''
                }
            });
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    })
];
// POST Facebook Signup / Login
exports.facebook_post = [
    passport_1.default.authenticate("facebook-token"),
    // Process request.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        res.status(201).json({
            message: "User FB authentication was successful.",
            user: {
                firstName: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.first_name,
                lastName: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.last_name,
                email: (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.email,
                id: (_d = req === null || req === void 0 ? void 0 : req.user) === null || _d === void 0 ? void 0 : _d._id,
                profileImageUrl: ((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e.profileImageUrl) ? (_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f.profileImageUrl : "",
                facebookId: (_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g.facebookId
            },
        });
    })
];
// POST login
exports.login_post = [
    express_validator_1.body("email", "Email address is required.").trim().isEmail().escape(),
    express_validator_1.body("password", "Password is required.").trim().isLength({ min: 1 }).escape(),
    // Process request after validation and sanitization.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Destructure request body object
        const { email, password } = req.body;
        // Extract the validation errors from a request.
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.status(400).json({
                errors: errors.array()
            });
        }
        try {
            const user = yield User.findOne({ email }).select("+password");
            if (user) {
                const passwordMatch = validatePassword(password, user);
                if (passwordMatch) {
                    const tokenObj = issueJWT(user);
                    return res.status(200).json({
                        message: "User logged in successfully.",
                        token: tokenObj,
                        user: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            id: user._id,
                            profileImageUrl: user.profileImageUrl ? user.profileImageUrl : ''
                        },
                    });
                }
                else {
                    res.status(401).json({ message: "Incorrect password." });
                }
            }
            else {
                return res.status(404).json({ message: "User not found." });
            }
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    })
];
//# sourceMappingURL=users.js.map