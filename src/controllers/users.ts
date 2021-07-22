import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
const User = require("../models/user");
const {
    issueJWT,
    generatePassword,
    validatePassword,
} = require("../utils/auth-utils");

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
            await user.save();
            const tokenObject = issueJWT(user);

            return res.status(200).json({
                message: "Signed up successfully",
                token: tokenObject,
                user: user
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
];