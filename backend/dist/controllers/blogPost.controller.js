"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blogPost_model_1 = __importDefault(require("../models/blogPost.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Create a new blog post
 */
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { title, summary, content, image } = req.body;
    if (!(title === null || title === void 0 ? void 0 : title.trim()) || !(content === null || content === void 0 ? void 0 : content.trim())) {
        res.status(400).json({ message: "Title and content are required" });
        return;
    }
    try {
        const user = user_model_1.default.findUserByUsername(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const newPost = yield blogPost_model_1.default.createPost({
            title: title.trim(),
            summary: summary === null || summary === void 0 ? void 0 : summary.trim(),
            content: content.trim(),
            image: image === null || image === void 0 ? void 0 : image.trim(),
            username: req.session.username
        });
        res.status(201).json({ message: "Post created successfully", post: newPost });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
});
/**
 * Get all posts for current user
 */
const getMyPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const posts = blogPost_model_1.default.getPostsByUsername(req.session.username);
        res.status(200).json({ posts });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
});
/**
 * Update a blog post
 */
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { id } = req.params;
    const { title, summary, content, image } = req.body;
    if (!(title === null || title === void 0 ? void 0 : title.trim()) || !(content === null || content === void 0 ? void 0 : content.trim())) {
        res.status(400).json({ message: "Title and content are required" });
        return;
    }
    try {
        // Verify the post belongs to the current user
        const existingPost = blogPost_model_1.default.getPostById(id);
        if (!existingPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (existingPost.username !== req.session.username) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const updatedPost = yield blogPost_model_1.default.updatePost(id, {
            title: title.trim(),
            summary: summary === null || summary === void 0 ? void 0 : summary.trim(),
            content: content.trim(),
            image: image === null || image === void 0 ? void 0 : image.trim()
        });
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
});
/**
 * Delete a blog post
 */
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { id } = req.params;
    try {
        // Verify the post belongs to the current user
        const existingPost = blogPost_model_1.default.getPostById(id);
        if (!existingPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (existingPost.username !== req.session.username) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const success = blogPost_model_1.default.deletePost(id);
        if (!success) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
});
/**
 * Search posts
 */
const searchPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
        res.status(400).json({ message: "Search query is required" });
        return;
    }
    try {
        const posts = blogPost_model_1.default.searchPosts(req.session.username, q);
        res.status(200).json({ posts });
    }
    catch (error) {
        res.status(500).json({ message: "Error searching posts" });
    }
});
exports.default = {
    createPost,
    getMyPosts,
    updatePost,
    deletePost,
    searchPosts
};
