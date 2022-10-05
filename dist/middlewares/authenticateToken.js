"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, result) => {
        if (err)
            return res.sendStatus(403);
        req.body.user = result;
        next();
    });
}
exports.default = authenticateToken;
