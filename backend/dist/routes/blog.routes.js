"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = __importDefault(require("../controllers/blog.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const blogRoutes = (0, express_1.Router)();
// Posts públicos
blogRoutes.get("/", blog_controller_1.default.getAllPosts);
blogRoutes.get("/:id", blog_controller_1.default.getPostById);
// Posts privados (requieren autenticación)
blogRoutes.post("/", auth_middleware_1.checkLogin, blog_controller_1.default.createPost);
blogRoutes.get("/user", auth_middleware_1.checkLogin, blog_controller_1.default.getUserPosts);
blogRoutes.put("/:id", auth_middleware_1.checkLogin, blog_controller_1.default.updatePost);
blogRoutes.delete("/:id", auth_middleware_1.checkLogin, blog_controller_1.default.deletePost);
exports.default = blogRoutes;
