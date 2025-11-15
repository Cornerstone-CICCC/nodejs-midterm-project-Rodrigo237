import { Request, Response } from "express";
import blogPostModel from "../models/blogPost.model";
import userModel from "../models/user.model";

/**
 * Create a new blog post
 */
const createPost = async (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { title, summary, content, image } = req.body;
    
    if (!title?.trim() || !content?.trim()) {
        res.status(400).json({ message: "Title and content are required" });
        return;
    }

    try {
        const user = userModel.findUserByUsername(req.session.username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const newPost = await blogPostModel.createPost({
            title: title.trim(),
            summary: summary?.trim(),
            content: content.trim(),
            image: image?.trim(),
            username: req.session.username
        });

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
};

/**
 * Get all posts for current user
 */
const getMyPosts = async (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    try {
        const posts = blogPostModel.getPostsByUsername(req.session.username);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
};

/**
 * Update a blog post
 */
const updatePost = async (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { id } = req.params;
    const { title, summary, content, image } = req.body;

    if (!title?.trim() || !content?.trim()) {
        res.status(400).json({ message: "Title and content are required" });
        return;
    }

    try {
        // Verify the post belongs to the current user
        const existingPost = blogPostModel.getPostById(id);
        if (!existingPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (existingPost.username !== req.session.username) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }

        const updatedPost = await blogPostModel.updatePost(id, {
            title: title.trim(),
            summary: summary?.trim(),
            content: content.trim(),
            image: image?.trim()
        });

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
    }
};

/**
 * Delete a blog post
 */
const deletePost = async (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { id } = req.params;

    try {
        // Verify the post belongs to the current user
        const existingPost = blogPostModel.getPostById(id);
        if (!existingPost) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        if (existingPost.username !== req.session.username) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }

        const success = blogPostModel.deletePost(id);
        if (!success) {
            res.status(404).json({ message: "Post not found" });
            return;
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
};

/**
 * Search posts
 */
const searchPosts = async (req: Request, res: Response) => {
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
        const posts = blogPostModel.searchPosts(req.session.username, q);
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: "Error searching posts" });
    }
};

export default {
    createPost,
    getMyPosts,
    updatePost,
    deletePost,
    searchPosts
};