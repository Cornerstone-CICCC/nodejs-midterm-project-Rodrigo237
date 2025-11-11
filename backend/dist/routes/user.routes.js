"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const userRoutes = (0, express_1.Router)();
userRoutes.post("/signup", auth_middleware_1.checkLogout, user_controller_1.default.signup);
userRoutes.post("/login", auth_middleware_1.checkLogout, user_controller_1.default.login);
userRoutes.get("/profile", auth_middleware_1.checkLogin, user_controller_1.default.getUserByUsername);
userRoutes.get("/logout", auth_middleware_1.checkLogin, user_controller_1.default.logout);
exports.default = userRoutes;
