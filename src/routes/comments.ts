export {};

const express = require('express');
const router = express.Router();
const passport = require('passport');
const getTokenData = require("../utils/getTokenData");

// Import comment controller
const commentController = require('../controllers/comments');

// Router Middleware
router.use(
    passport.authenticate('jwt', { session: false })
);

// By default, if authentication fails, Passport will respond with a 401 Unauthorized status, 
// and any additional route handlers will not be invoked. If authentication succeeds, the next 
// handler will be invoked and the req.user property will be set to the authenticated user.
// getTokenData returns any user information stored within the JWT token and adds to req object.

router.use(getTokenData);

// COMMENT ROUTES

// POST create comment - /api/posts/:postId/comments
router.post('/:postId/comments', commentController.create_comment);

// // PUT edit comment - /api/posts/:postId/comments/:commentid
// router.put('/posts/:postId/comments/:commentid', [
//     commentController.edit_comment
// ]);

// // PUT toggle like comment - /api/posts/:postId/comments/:commentid/like
// router.put('/posts/:postId/comments/:commentid/like', [
//     commentController.toggle_like_comment
// ]);

// // DELETE single comment - /api/posts/:postId/comments/:commentid
// router.delete('/posts/:postId/comments/:commentid', [
//     commentController.delete_comment
// ]);

module.exports = router;