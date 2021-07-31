export {};

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import comment controller
const userController = require('../controllers/user');

// USER ROUTES

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

module.exports = router;