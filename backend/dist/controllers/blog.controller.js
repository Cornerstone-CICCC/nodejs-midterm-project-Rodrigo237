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
const blog_model_1 = __importDefault(require("../models/blog.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Crear un nuevo post (requiere autenticación)
 * @route POST /posts
 */
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Debugging logs to help trace why posts may not be created
        console.log('createPost called - session:', req.session, 'body:', req.body);
        if (!req.session || !req.session.username) {
            console.warn('createPost: no session or username in session');
            res.status(401).json({ message: "Unauthorized. Please log in." });
            return;
        }
        const { title, content, summary } = req.body;
        if (!title || !String(title).trim() || !content || !String(content).trim()) {
            res.status(400).json({ message: "Title and content are required" });
            return;
        }
        // Obtener usuario actual
        const user = user_model_1.default.findUserByUsername(req.session.username);
        if (!user) {
            console.warn('createPost: user from session not found:', req.session.username);
            res.status(404).json({ message: "User not found" });
            return;
        }
        const post = yield blog_model_1.default.createPost({
            userId: user.id,
            username: user.username,
            title: String(title),
            content: String(content),
            summary: summary ? String(summary) : String(content).substring(0, 100) + "..."
        });
        console.log('createPost: post created id=', post.id);
        res.status(201).json(post);
    }
    catch (err) {
        console.error('createPost error:', err);
        res.status(500).json({ message: "Error creating post" });
    }
});
/**
 * Obtener todos los posts
 * @route GET /posts
 */
const getAllPosts = (req, res) => {
    try {
        const posts = blog_model_1.default.getAllPosts();
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching posts" });
    }
};
/**
 * Obtener posts del usuario autenticado
 * @route GET /posts/user
 */
const getUserPosts = (req, res) => {
    try {
        if (!req.session || !req.session.username) {
            res.status(401).json({ message: "Unauthorized. Please log in." });
            return;
        }
        const user = user_model_1.default.findUserByUsername(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const posts = blog_model_1.default.getUserPosts(user.id);
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user posts" });
    }
};
/**
 * Obtener un post por ID
 * @route GET /posts/:id
 */
const getPostById = (req, res) => {
    try {
        const { id } = req.params;
        const post = blog_model_1.default.getPostById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching post" });
    }
};
/**
 * Actualizar un post (solo el propietario)
 * @route PUT /posts/:id
 */
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.session || !req.session.username) {
            res.status(401).json({ message: "Unauthorized. Please log in." });
            return;
        }
        const { id } = req.params;
        const post = blog_model_1.default.getPostById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.username !== req.session.username) {
            res.status(403).json({ message: "You can only edit your own posts" });
            return;
        }
        const { title, content, summary } = req.body;
        const updated = yield blog_model_1.default.updatePost(id, {
            title: title || post.title,
            content: content || post.content,
            summary: summary || post.summary
        });
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({ message: "Error updating post" });
    }
});
/**
 * Eliminar un post (solo el propietario)
 * @route DELETE /posts/:id
 */
const deletePost = (req, res) => {
    try {
        if (!req.session || !req.session.username) {
            res.status(401).json({ message: "Unauthorized. Please log in." });
            return;
        }
        const { id } = req.params;
        const post = blog_model_1.default.getPostById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.username !== req.session.username) {
            res.status(403).json({ message: "You can only delete your own posts" });
            return;
        }
        const success = blog_model_1.default.deletePost(id);
        if (!success) {
            res.status(500).json({ message: "Error deleting post" });
            return;
        }
        res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting post" });
    }
};
exports.default = {
    createPost,
    getAllPosts,
    getUserPosts,
    getPostById,
    updatePost,
    deletePost
};
