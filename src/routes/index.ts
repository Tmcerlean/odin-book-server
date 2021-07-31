export {};

const express = require("express");
const router = express.Router();

const authRouter = require('./routes/auth');
const commentsRouter = require('./routes/comments');
const friendsRouter = require('./routes/friends');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

router.use("auth", authRouter);
router.use("comments", commentsRouter);
router.use("friends", friendsRouter);
router.use("posts", postsRouter);
router.use("users", usersRouter);

module.exports = router;