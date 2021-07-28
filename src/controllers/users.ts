import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
const User = require('../models/user');
const {
    issueJWT,
    generatePassword,
    validatePassword,
} = require('../utils/auth-utils');

// POST signup
exports.signup_post = [

    // Validate and sanitize fields
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name contains non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
    .isAlphanumeric().withMessage('Last name contains non-alphanumeric characters.'),
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters.'),
    
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
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
];

// POST Facebook Signup / Login
exports.facebook_post = [
    // TODO
]

// POST login
exports.login_post = [
  
    body("email", "Email address is required.").trim().isEmail().escape(),
    body("password", "Password is required.").trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    async (req: Request, res: Response, next: NextFunction) => {

        // Destructure request body object
        const { email, password } = req.body;

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const user = await User.findOne({ email }).select("+password");

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
                    })
                } else {
                    res.status(401).json({ message: "Incorrect password." });
                }
            } else {
                return res.status(404).json({ message: "User not found." });
            }
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
];