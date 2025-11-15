"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogPost_controller_1 = __importDefault(require("../controllers/blogPost.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_1 = require("express");
const blogPostRouter = (0, express_1.Router)();
blogPostRouter.post("/posts", auth_middleware_1.checkLogin, blogPost_controller_1.default.createPost);
blogPostRouter.get("/posts/my-posts", auth_middleware_1.checkLogin, blogPost_controller_1.default.getMyPosts);
blogPostRouter.put("/posts/:id", auth_middleware_1.checkLogin, blogPost_controller_1.default.updatePost);
blogPostRouter.delete("/posts/:id", auth_middleware_1.checkLogin, blogPost_controller_1.default.deletePost);
blogPostRouter.get("/posts/search", auth_middleware_1.checkLogin, blogPost_controller_1.default.searchPosts);
exports.default = blogPostRouter;
