"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const passport = require('passport');
// Import comment controller
const commentController = require('../controllers/comments');
// COMMENT ROUTES
// // POST create comment - /api/posts/:postid/comments
// router.post('/posts/:postid/comments', [
//     commentController.create_comment
// ]);
// // PUT edit comment - /api/posts/:postid/comments/:commentid
// router.put('/posts/:postid/comments/:commentid', [
//     commentController.edit_comment
// ]);
// // PUT toggle like comment - /api/posts/:postid/comments/:commentid/like
// router.put('/posts/:postid/comments/:commentid/like', [
//     commentController.toggle_like_comment
// ]);
// // DELETE single comment - /api/posts/:postid/comments/:commentid
// router.delete('/posts/:postid/comments/:commentid', [
//     commentController.delete_comment
// ]);
module.exports = router;
//# sourceMappingURL=comments.js.map