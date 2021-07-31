export {};

const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import friend controller
const friendController = require('../controllers/friend');

// FRIEND ROUTES

// // POST send friend request - /api/request
// router.post('/request', friendController.friend_request_post);

// // DELETE cancel friend request - /api/request
// router.delete('/request', friendController.friend_request_delete);

// // PUT accept friend request - /api/accept
// router.put('/accept', friendController.friend_request_accept);

// // DELETE decline friend request - /api/decline
// router.delete('/decline', friendController.friend_request_decline);

module.exports = router;