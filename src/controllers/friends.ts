import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const User = require("../models/user");