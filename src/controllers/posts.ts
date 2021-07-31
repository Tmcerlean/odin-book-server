import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const Post = require('../models/post');

exports.create_post = [

    // Validate and sanitize fields
    body("content").isLength({ min: 1 }).withMessage("Content must contain at least 1 character.").escape(),
  
    // Process request after validation and sanitization.
    async (req: Request, res: Response, next: NextFunction) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors in the form data.
            return res.json({
                data: req.body,
                errors: errors.array(),
            });
        }
        
        // Data from form is valid.

        // Create new post and save
        const { content } = req.body;
        const post = new Post({
            author: req.payload.id,
            content,
        });

        try {
            const newPost = await post.save();

            // Populate author's post array with newly created post
            const savedPost = await Post.findById(newPost._id).populate("author");
            
            if (savedPost) {
                return res.status(200).json({ 
                    message: "Post saved.", post: savedPost 
                });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
];