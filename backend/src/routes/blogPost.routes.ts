
import blogPostController from "../controllers/blogPost.controller";
import { checkLogin} from "../middleware/auth.middleware";
import { Router } from "express";

const blogPostRouter = Router();

blogPostRouter.post("/posts",checkLogin,blogPostController.createPost);
blogPostRouter.get("/posts/my-posts",checkLogin,blogPostController.getMyPosts);
blogPostRouter.put("/posts/:id",checkLogin,blogPostController.updatePost);
blogPostRouter.delete("/posts/:id",checkLogin,blogPostController.deletePost);
blogPostRouter.get("/posts/search",checkLogin,blogPostController.searchPosts);

export default blogPostRouter;
