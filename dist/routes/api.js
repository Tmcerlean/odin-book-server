"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
// const passport = require('passport');
// Import controllers
const commentController = require('../controllers/comments');
const postController = require('../controllers/posts');
const userController = require('../controllers/users');
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
// // POST ROUTES
// // GET single post - /api/posts/:id
// router.get('/posts/:id', postController.get_post);
// // GET all posts - /api/posts
// router.get('/posts', postController.get_posts);
// // POST create post - /api/posts
// router.post('/posts', [
//   postController.create_post
// ]);
// // PUT edit post - /api/posts/:id
// router.put('/posts/:id', [
//   postController.edit_post
// ]);
// // DELETE post - /api/posts/:id
// router.delete('/posts/:id', [
//   postController.delete_post
// ]);
// // USER ROUTES
// // GET all users - /api/
// router.get('/', userController.user_all_get);
// // GET user profile - /api/:userId
// router.get('/:userId', userController.user_get);
// // PUT edit user profile - /api/:userId
// router.put('/:userId', userController.user_edit_profile);
// // DELETE user profile /api/:userId
// router.delete('/:userId', userController.user_delete);
// // POST add user profile image - /api/:userId/profileimage
// router.post('/:userId/profileimage', userController.user_add_profile_image);
// POST request for user log in - /api/login
router.post('/login', userController.login_post);
// // POST request for log out - /api/logout
// router.post('/logout', userController.logout_post);
// POST request for user sign up - /api/signup
router.post('/signup', userController.signup_post);
// // POST send friend request - /api/request
// router.post('/request', userController.friend_request_post);
// // DELETE cancel friend request - /api/request
// router.delete('/request', userController.friend_request_delete);
// // PUT accept friend request - /api/accept
// router.put('/accept', userController.friend_request_accept);
// // DELETE decline friend request - /api/decline
// router.delete('/decline', userController.friend_request_decline);
module.exports = router;
//# sourceMappingURL=api.js.map