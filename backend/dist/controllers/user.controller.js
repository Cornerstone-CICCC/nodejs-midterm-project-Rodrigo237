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
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Sign up a new user
 *
 * @route POST /users/signup
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Respond with success or error message
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstName, lastName } = req.body;
    if (!username.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
        res.status(500).json({ message: "All fields are required" });
        return;
    }
    const isSuccess = yield user_model_1.default.createUser({ username, password, firstName, lastName });
    if (!isSuccess) {
        res.status(500).json({ message: "Username already exists" });
        return;
    }
    res.status(201).json({ message: "User created successfully" });
});
/**
 * Log in an existing user
 *
 * @route POST /users/login
 * @param {Request<{},{},Omit<User,'id'| 'firstName' | 'lastName'>} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with success or error message
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username.trim() || !password.trim()) {
        res.status(500).json({ message: "All fields are required" });
        return;
    }
    const user = yield user_model_1.default.loginUser({ username, password });
    if (!user) {
        res.status(500).json({ message: "Invalid username or password" });
        return;
    }
    // Save username in session so protected routes can identify the user
    if (req.session) {
        req.session.username = user.username;
    }
    res.status(200).json({ message: "Login successful" });
});
/**
 * Get user details by username
 *
 * @route GET /users/:username
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with user details or error message
 */
const getUserByUsername = (req, res) => {
    if (!req.session || !req.session.username) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { username } = req.session;
    const user = user_model_1.default.findUserByUsername(username);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json({ username: user.username, firstName: user.firstName, lastName: user.lastName });
};
/**
 * Log out the current user
 *
 * @route POST /users/logout
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void} Respond with success message
 */
const logout = (req, res) => {
    if (req.session) {
        req.session = null;
    }
    res.status(200).json({ message: "Logout successful" });
};
exports.default = {
    signup,
    login,
    getUserByUsername,
    logout
};
