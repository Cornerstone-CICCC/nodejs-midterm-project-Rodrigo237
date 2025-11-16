import { Request, Response } from "express"
import { User } from "../types/user"
import userModel from "../models/user.model";
/**
 * Sign up a new user
 * 
 * @route POST /users/signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Respond with success or error message
 */
const signup = async (req:Request<{},{},Omit<User,'id'>>, res:Response) =>{
    const { username, password, firstName, lastName, profileImage, occupation } = req.body;
    if(!username.trim() || !password.trim() || !firstName.trim() || !lastName.trim() || (profileImage !== undefined && !profileImage.trim()) || (occupation !== undefined && !occupation.trim())){
        res.status(500).json({message: "All fields are required"});
        return;
    }
    const isSuccess: boolean = await userModel.createUser({username,password,firstName,lastName, profileImage, occupation});
    if(!isSuccess){
        res.status(500).json({message: "Username already exists"});
        return;
    }
    res.status(201).json({message: "User created successfully"});
}

/**
 * Log in an existing user
 * 
 * @route POST /users/login
 * @param {Request<{},{},Omit<User,'id'| 'firstName' | 'lastName'>} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with success or error message
 */

const login = async (req:Request<{},{},Omit<User,'id'| 'firstName' | 'lastName'| 'profileImage'| 'occupation'>>, res:Response) =>{
    const { username, password } = req.body;
    if(!username.trim() || !password.trim()){
        res.status(500).json({message: "All fields are required"});
        return;
    }
    const user = await userModel.loginUser({username,password});
    if(!user){
        res.status(500).json({message: "Invalid username or password"});
        return;
    }
    // Save username in session so protected routes can identify the user
    if (req.session) {
        req.session.username = user.username
    }
    res.status(200).json({message: "Login successful"});
}

/**
 * Get user details by username
 * 
 * @route GET /users/:username
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with user details or error message
 */

const getUserByUsername = (req:Request, res:Response) =>{
    if(!req.session || !req.session.username){
        res.status(401).json({message: "Unauthorized"});
        return;
    }
    const { username } = req.session;
    const user = userModel.findUserByUsername(username);
    if(!user){
        res.status(404).json({message: "User not found"});
        return;
    }
    res.status(200).json({username: user.username, firstName: user.firstName, lastName: user.lastName, profileImage: user.profileImage, occupation: user.occupation});
}

/**
 * Log out the current user
 * 
 * @route POST /users/logout
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with success message
 */

const logout = (req:Request, res:Response) =>{
    if(req.session){
        req.session = null;
    }
    res.status(200).json({message: "Logout successful"});
}


/**
 * Update user profile details
 * 
 * @route PUT /profile
 * @param {Request<{},{},Partial<Omit<User,'id' | 'username'>>>} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with success or error message
 */

const updateProfile = async (req: Request, res: Response) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { profileImage, occupation } = req.body;
    try {
        const updatedUser = await userModel.updateUserProfile(req.session.username, {
            profileImage,
            occupation
        });
        if (!updatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ 
            message: "Profile updated successfully",
            user: {
                username: updatedUser.username,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                profileImage: updatedUser.profileImage,
                occupation: updatedUser.occupation
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
};


export default{
    signup,
    login,
    getUserByUsername,
    logout,
    updateProfile
}