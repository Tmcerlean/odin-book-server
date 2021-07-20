const express = require('express');
const router = express.Router();
// const passport = require('passport');

// Import controllers
const commentController = require('../controllers/comments');
const postController = require('../controllers/posts');
const userController = require('../controllers/users');

// COMMENT ROUTES

// POST create comment - /api/posts/:postid/comments
router.post('/posts/:postid/comments', [
    commentController.create_comment
]);

// PUT edit comment - /api/posts/:postid/comments/:commentid
router.put('/posts/:postid/comments/:commentid', [
    commentController.edit_comment
]);

// PUT toggle like comment - /api/posts/:postid/comments/:commentid/like
router.put('/posts/:postid/comments/:commentid/like', [
    commentController.toggle_like_comment
]);

// DELETE single comment - /api/posts/:postid/comments/:commentid
router.delete('/posts/:postid/comments/:commentid', [
    commentController.delete_comment
])


// POST ROUTES

// GET single post - /api/posts/:id
router.get('/posts/:id', postController.get_post)

// GET all posts - /api/posts
router.get('/posts', postController.get_posts)

// POST create post - /api/posts
router.post('/posts', [
  postController.create_post
])

// PUT edit post - /api/posts/:id
router.put('/posts/:id', [
  postController.edit_post
])

// DELETE post - /api/posts/:id
router.delete('/posts/:id', [
  postController.delete_post
])


// USER ROUTES

// GET user profile - /api/:userId
router.get('/:userId', userController.user_get);

// PUT edit user profile - /api/:userId
router.put('/:userId', userController.user_edit_profile);

// PUT edit user profile image - /api/:userId/profileimage
router.put('/:userId/profileimage', userController.user_edit_profile_image)

// POST request for user log in - /api/login
router.post('/login', userController.login_post);

// POST request for log out - /api/logout
router.post('/logout', userController.logout_post);

// POST request for user sign up - /api/signup
router.post('/signup', userController.signup_post);

module.exports = router;