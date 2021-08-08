import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const Comment = require("../models/comment");
const Post = require("../models/post");

exports.create_comment = [

    // Validate and sanitize fields
    body("content").isLength({ min: 1 }).withMessage("Comment must contain at least 1 character.").escape(),
  
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

        // Create new comment and save
        const { content } = req.body;
        const comment = new Comment({
            author: req.payload.id,
            comment: content,
            post: req.params.postId
        });

        try {
            const newComment = await comment.save();

            // Find post and add comment to array
            const postCommented = await Post.findById(req.params.postId);
            postCommented.comments.push(newComment);
            await postCommented.save();

            // Populate new comment with author data
            const savedComment = await Comment.findById(newComment._id).populate("author");
            
            if (savedComment) {
                return res.status(200).json({ 
                    message: "Comment saved.", comment: savedComment 
                });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
];