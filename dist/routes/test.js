"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
/* GET user profile. */
router.get('/profile', function (req, res, next) {
    res.send(req.user);
});
module.exports = router;
//# sourceMappingURL=test.js.map