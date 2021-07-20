"use strict";
const express = require('express');
const router = express.Router();
// const passport = require('passport');
// Import controllers
const commentController = require('../controllers/comments');
// Comment routes
// GET all comments - /api/comments
router.get('/comments', commentController.get_comments);
module.exports = router;
//# sourceMappingURL=api.js.map