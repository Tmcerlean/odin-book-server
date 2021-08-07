import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const Post = require('../models/post');
const User = require('../models/user');

exports.get_posts = [
    // Process request.
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get logged in user object
            const loggedInUser = await User.findById(req.payload.id);

            // Get user + friends posts by spreading in friends array
            const posts = await Post.find({
                author: [req.payload.id, ...loggedInUser.friends]
            }, null, { limit: 10 })
            .sort({ timestamp: "desc" })
            .populate("author")
            .populate({
                path: "comments",
                model: "Comment",
                populate: {
                    path: "user",
                    model: "User",
                }
            });

            return res.status(200).json({ posts: posts }); 
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
];

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

exports.like_post = [
 
    // Process request.
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            // Find post by id
            const likedPost = await Post.findById(req.params.id);

            // Handle case where no post was found
            if (!likedPost) {
                return res.status(404).json({ message: "Post not found" });
            }

            // If user id is within post's like array then remove user id
            if (likedPost.likes.includes(req.payload.id)) {
                const likesArray = [...likedPost.likes];
                const filteredLikesArray = likesArray.filter(
                  (userId) => userId != req.payload.id
                );
                likedPost.likes = filteredLikesArray;

                // Save updated post
                const updatedPost = await likedPost.save();
                return res.status(200).json({ message: "Post unliked", post: updatedPost });

            // Else add user id
            } else {
                likedPost.likes.push(req.payload.id);

                // Save updated post
                const updatedPost = await likedPost.save();
                return res.status(200).json({ message: "Post liked", post: updatedPost });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
];