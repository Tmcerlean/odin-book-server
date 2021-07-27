export {};

const express = require('express');

const router = express.Router();

/* GET user profile. */
router.get('/profile', function(req: any, res: any, next: any) {
    res.send(req.user);
});

module.exports = router;