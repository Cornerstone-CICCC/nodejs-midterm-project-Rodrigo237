"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogout = exports.checkLogin = void 0;
const checkLogin = (req, res, next) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({
            message: "Unauthorized! Please log in."
        });
        return;
    }
    next();
};
exports.checkLogin = checkLogin;
const checkLogout = (req, res, next) => {
    if (req.session && req.session.username) {
        res.status(400).json({
            message: "You are already logged in!"
        });
        return;
    }
    next();
};
exports.checkLogout = checkLogout;
