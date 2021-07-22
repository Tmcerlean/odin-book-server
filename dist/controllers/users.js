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
const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
            return res.json({
                email: req.body.email,
                errors: errors.array(),
            });
        }
        else {
            // Data from form is valid.
            // Check if username already exists.
            yield User.findOne({ 'email': req.body.email })
                .exec(function (err, found_email) {
                // TEST CODE - REMOVE
                res.status(200).json({
                    message: "Sign up failed",
                    test: found_email
                });
                if (found_email) {
                    return next(err);
                }
                else if (err) {
                    return next(err);
                }
                else {
                    //Create a user object with escaped and trimmed data
                    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                        // If err, do something
                        if (err) {
                            return next(err);
                        }
                        ;
                        // Otherwise, store hashedPassword in DB
                        const user = new User({
                            firstName: req.body.first_name,
                            lastName: req.body.last_name,
                            email: req.body.email,
                            hashedPassword: hashedPassword
                        }).save((err) => {
                            if (err) {
                                // TEST CODE - REMOVE
                                res.status(200).json({
                                    message: "Sign up faileds",
                                    test: err
                                });
                                return next(err);
                            }
                            ;
                            res.status(200).json({
                                message: "Signed up successfully",
                                // user: req.user,
                            });
                        });
                    });
                }
            });
        }
    })
];
//# sourceMappingURL=users.js.map