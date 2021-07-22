import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
const User = require("../models/user");
const bcrypt = require("bcryptjs");

interface FoundEmail {
    posts: String[],
    friends: String[],
    friendRequests: String[],
    _id: String,
    firstName: String,
    lastName: String,
    email: String,
    hashedPassword: String,
    __v: Number
}

exports.signup_post = [

    // Validate and sanitize fields
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified')
    .isAlphanumeric().withMessage('First name contains non-alphanumeric characters'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified')
    .isAlphanumeric().withMessage('Last name contains non-alphanumeric characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
    body("password").isLength({ min: 6 }).withMessage("Password must contain at least 6 characters"),
    

    // Process request after validation and sanitization.
    async (req: Request, res: Response, next: NextFunction) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.json({
                email: req.body.email,
                errors: errors.array(),
            });
        }
        else {
            // Data from form is valid.

            // // Check if username already exists.
            // await User.findOne({ 'email': req.body.email })
            //     .exec(function(err: Error, found_email: FoundEmail) {

            //         // TEST CODE - REMOVE
            //         res.status(200).json({
            //             message: "Sign up failed",
            //             test: found_email
            //         });

            //         if (found_email) {
            //             return next(err);
            //         }

            //         else if (err) { return next(err); }
                    
            //         else {
                        //Create a user object with escaped and trimmed data
                        bcrypt.hash(req.body.password, 10, (err: Error, hashedPassword: String) => {
                          
                            // If err, do something
                            if (err) { 
                                return next(err);
                            };
                            // Otherwise, store hashedPassword in DB
                            const user = new User({
                                firstName: req.body.first_name,
                                lastName: req.body.last_name,
                                email: req.body.email,
                                hashedPassword: hashedPassword
                            }).save((err: Error) => {
                                if (err) { 
                                    // TEST CODE - REMOVE
                                    res.status(200).json({
                                        message: "Sign up faileds",
                                        test: err
                                    });
                                    return next(err);
                                };
                                res.status(200).json({
                                    message: "Signed up successfully",
                                    // user: req.user,
                                });
                            });
                        });
                //     }
                // })
        }
    }
];