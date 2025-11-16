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
class BlogModel {
    constructor() {
        this.posts = [];
    }
    // Crear un nuevo post
    createPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, newPost), { createdAt: new Date(), updatedAt: new Date() });
            this.posts.push(post);
            return post;
        });
    }
    // Obtener todos los posts
    getAllPosts() {
        return this.posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    // Obtener posts de un usuario específico
    getUserPosts(userId) {
        return this.posts
            .filter(post => post.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    // Obtener un post por ID
    getPostById(postId) {
        return this.posts.find(post => post.id === postId) || null;
    }
    // Actualizar un post
    updatePost(postId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.posts.find(p => p.id === postId);
            if (!post)
                return null;
            Object.assign(post, updates, { updatedAt: new Date() });
            return post;
        });
    }
    // Eliminar un post
    deletePost(postId) {
        const index = this.posts.findIndex(p => p.id === postId);
        if (index === -1)
            return false;
        this.posts.splice(index, 1);
        return true;
    }
}
exports.default = new BlogModel();
