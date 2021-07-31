export {};

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import post controller
const postController = require('../controllers/post');

// POST ROUTES

// // GET single post - /api/posts/:id
// router.get('/posts/:id', postController.get_post);

// // GET all posts - /api/posts
// router.get('/posts', postController.get_posts);

// POST create post - /api/posts
router.post('/posts', [
    passport.authenticate('jwt', {session: false}),
    postController.create_post
]);
  
// // PUT edit post - /api/posts/:id
// router.put('/posts/:id', [
//   postController.edit_post
// ]);

// // DELETE post - /api/posts/:id
// router.delete('/posts/:id', [
//   postController.delete_post
// ]);

module.exports = router;