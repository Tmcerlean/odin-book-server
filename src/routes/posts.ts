export {};

const express = require('express');
const router = express.Router();
const passport = require('passport');
const getTokenData = require("../utils/getTokenData");

// Import post controller
const postController = require('../controllers/posts');

// Router Middleware
router.use(
    passport.authenticate('jwt', { session: false })
);

// By default, if authentication fails, Passport will respond with a 401 Unauthorized status, 
// and any additional route handlers will not be invoked. If authentication succeeds, the next 
// handler will be invoked and the req.user property will be set to the authenticated user.
// getTokenData returns any user information stored within the JWT token and adds to req object.

router.use(getTokenData);

// POST ROUTES

// // GET single post - /api/posts/:id
// router.get('/posts/:id', postController.get_post);

// // GET all posts - /api/posts
router.get('/', postController.get_posts);

// POST create post - /api/posts
router.post('/', postController.create_post);
  
// // PUT edit post - /api/posts/:id
// router.put('/posts/:id', postController.edit_post);

// // DELETE post - /api/posts/:id
// router.delete('/posts/:id', postController.delete_post);

module.exports = router;