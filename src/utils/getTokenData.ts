import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

const ExtractJwt = require("passport-jwt").ExtractJwt;

interface TokenPayloadRequest extends Request {
    payload: any
}

const getTokenData = (req: TokenPayloadRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    const payload = jwt.verify(jwtFromRequest(req), process.env.JWT_SECRET);
    req.payload = payload;
  } else {
    req.payload = req.user;
  }

  next();
};

module.exports = getTokenData;