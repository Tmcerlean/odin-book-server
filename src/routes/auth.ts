export {};

const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/auth');

// POST request for user log in - /api/auth/login
router.post('/login', authController.login_post);

// // POST request for log out - /api/logout
router.post('/logout', authController.logout_post);

// POST request for user sign up - /api/signup
router.post('/signup', authController.signup_post);

// POST request for Facebook sign up / login - /api/facebook
// router.post('/facebook', authController.facebook_post);

module.exports = router;