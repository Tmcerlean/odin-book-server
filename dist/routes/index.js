"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const authRouter = require('./auth');
const commentsRouter = require('./comments');
const friendsRouter = require('./friends');
const postsRouter = require('./posts');
const usersRouter = require('./users');
router.use("/auth", authRouter);
router.use("/comments", commentsRouter);
router.use("/friends", friendsRouter);
router.use("/posts", postsRouter);
router.use("/users", usersRouter);
module.exports = router;
//# sourceMappingURL=index.js.map