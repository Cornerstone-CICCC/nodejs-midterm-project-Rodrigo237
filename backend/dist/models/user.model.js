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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [];
    }
    // Create a new user
    createUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, firstName, lastName } = newUser;
            const foundIndex = this.users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
            if (foundIndex !== -1)
                return false;
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            this.users.push({
                id: (0, uuid_1.v4)(),
                username,
                password: hashedPassword,
                firstName,
                lastName
            });
            return true;
        });
    }
    // login user
    loginUser(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = details;
            const foundUser = this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
            if (!foundUser)
                return null;
            const isMatch = yield bcrypt_1.default.compare(password, foundUser.password);
            if (!isMatch)
                return null;
            return foundUser;
        });
    }
    // find user by username
    findUserByUsername(username) {
        const foundUser = this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
        if (!foundUser)
            return false;
        return foundUser;
    }
}
exports.default = new UserModel;
