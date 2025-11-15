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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class BlogPostModel {
    constructor() {
        this.blogPosts = [];
    }
    // Create a new blog post
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, newPost);
            this.blogPosts.push(post);
            return post;
        });
    }
    // Get all posts by username
    getPostsByUsername(username) {
        return this.blogPosts.filter(post => post.username === username);
    }
    // Get post by ID
    getPostById(id) {
        return this.blogPosts.find(post => post.id === id);
    }
    // Update post
    updatePost(id, updatedPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundIndex = this.blogPosts.findIndex(post => post.id === id);
            if (foundIndex === -1)
                return null;
            this.blogPosts[foundIndex] = Object.assign(Object.assign(Object.assign({}, this.blogPosts[foundIndex]), updatedPost), { updatedAt: new Date().toISOString() });
            return this.blogPosts[foundIndex];
        });
    }
    // Delete post
    deletePost(id) {
        const foundIndex = this.blogPosts.findIndex(post => post.id === id);
        if (foundIndex === -1)
            return false;
        this.blogPosts.splice(foundIndex, 1);
        return true;
    }
    // Search posts by username and query
    searchPosts(username, query) {
        const userPosts = this.getPostsByUsername(username);
        const q = query.toLowerCase();
        return userPosts.filter(post => post.title.toLowerCase().includes(q) ||
            (post.summary || '').toLowerCase().includes(q) ||
            post.content.toLowerCase().includes(q));
    }
}
exports.default = new BlogPostModel();
