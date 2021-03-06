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
const Post = require('../models/post');
const User = require('../models/user');
exports.get_posts = [
    // Process request.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get logged in user object
            const loggedInUser = yield User.findById(req.payload.id);
            // Get user + friends posts by spreading in friends array
            const posts = yield Post.find({
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
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    })
];
exports.create_post = [
    // Validate and sanitize fields
    express_validator_1.body("content").isLength({ min: 1 }).withMessage("Post must contain at least 1 character.").escape(),
    // Process request after validation and sanitization.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = express_validator_1.validationResult(req);
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
            const newPost = yield post.save();
            // Populate author's post array with newly created post
            const savedPost = yield Post.findById(newPost._id).populate("author");
            if (savedPost) {
                return res.status(200).json({
                    message: "Post saved.", post: savedPost, test: newPost
                });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
];
exports.like_post = [
    // Process request.
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Find post by id
            const likedPost = yield Post.findById(req.params.id);
            // Handle case where no post was found
            if (!likedPost) {
                return res.status(404).json({ message: "Post not found" });
            }
            // If user id is within post's like array then remove user id
            if (likedPost.likes.includes(req.payload.id)) {
                const likesArray = [...likedPost.likes];
                const filteredLikesArray = likesArray.filter((userId) => userId != req.payload.id);
                likedPost.likes = filteredLikesArray;
                // Save updated post
                const updatedPost = yield likedPost.save();
                return res.status(200).json({ message: "Post unliked", post: updatedPost });
                // Else add user id
            }
            else {
                likedPost.likes.push(req.payload.id);
                // Save updated post
                const updatedPost = yield likedPost.save();
                return res.status(200).json({ message: "Post liked", post: updatedPost });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    })
];
//# sourceMappingURL=posts.js.map