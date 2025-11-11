import { Router } from "express";
import userController from "../controllers/user.controller";
import { checkLogin, checkLogout } from "../middleware/auth.middleware";


const userRoutes = Router();

userRoutes.post("/signup",checkLogout,userController.signup);
userRoutes.post("/login",checkLogout,userController.login);
userRoutes.get("/profile",checkLogin,userController.getUserByUsername);
userRoutes.get("/logout",checkLogin,userController.logout);

export default userRoutes;