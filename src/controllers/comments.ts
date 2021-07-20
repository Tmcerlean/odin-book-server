import { NextFunction, Request, Response } from "express";

const { body, validationResult } = require('express-validator');
// const Comment = require("../models/comment");

// THIS IS A TEST

exports.get_comments = async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json({ 
            message: "Working" 
        });
    } catch (err) {
        next(err);
    }
};