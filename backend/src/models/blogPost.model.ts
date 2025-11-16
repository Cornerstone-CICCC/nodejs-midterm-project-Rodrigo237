import { BlogPost } from "../types/user";
import { v4 as uuidv4 } from 'uuid';

class BlogPostModel {
    private blogPosts: BlogPost[] = [];

    // Create a new blog post
    async createPost(newPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { username: string }) {
        const post: BlogPost = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...newPost
        };
        this.blogPosts.push(post);
        return post;
    }

    // Get all posts by username
    getPostsByUsername(username: string) {
        return this.blogPosts.filter(post => post.username === username);
    }

    // Get post by ID
    getPostById(id: string) {
        return this.blogPosts.find(post => post.id === id);
    }

    // Update post
    async updatePost(id: string, updatedPost: Partial<Omit<BlogPost, 'id' | 'createdAt' | 'username'>>) {
        const foundIndex = this.blogPosts.findIndex(post => post.id === id);
        if (foundIndex === -1) return null;

        this.blogPosts[foundIndex] = {
            ...this.blogPosts[foundIndex],
            ...updatedPost,
            updatedAt: new Date().toISOString()
        };
        return this.blogPosts[foundIndex];
    }

    // Delete post
    deletePost(id: string) {
        const foundIndex = this.blogPosts.findIndex(post => post.id === id);
        if (foundIndex === -1) return false;

        this.blogPosts.splice(foundIndex, 1);
        return true;
    }

    // Search posts by username and query
    searchPosts(username: string, query: string) {
        const userPosts = this.getPostsByUsername(username);
        const q = query.toLowerCase();
        return userPosts.filter(post => 
            post.title.toLowerCase().includes(q) ||
            (post.summary || '').toLowerCase().includes(q) ||
            post.content.toLowerCase().includes(q)
        );
    }
}

export default new BlogPostModel();