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
const Comment = require("../models/comment");
const Post = require("../models/post");
exports.create_comment = [
    // Validate and sanitize fields
    express_validator_1.body("content").isLength({ min: 1 }).withMessage("Comment must contain at least 1 character.").escape(),
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
        // Create new comment and save
        const { content } = req.body;
        const comment = new Comment({
            author: req.payload.id,
            comment: content,
            post: req.params.postId
        });
        try {
            const newComment = yield comment.save();
            // Find post and add comment to array
            const postCommented = yield Post.findById(req.params.postId);
            postCommented.comments.push(newComment);
            yield postCommented.save();
            // Populate new comment with author data
            const savedComment = yield Comment.findById(newComment._id).populate("author");
            if (savedComment) {
                return res.status(200).json({
                    message: "Comment saved.", comment: savedComment
                });
            }
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
];
//# sourceMappingURL=comments.js.map