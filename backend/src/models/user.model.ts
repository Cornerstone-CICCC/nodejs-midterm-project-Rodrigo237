import { User } from "../types/user";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
class UserModel {
    private users: User[] = [];

    // Create a new user
    async createUser(newUser: Omit<User, 'id'>){
        const {username,password,firstName,lastName} = newUser;
        const foundIndex  = this.users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
        if(foundIndex !== -1) return false;
        const hashedPassword = await bcrypt.hash(password,12);
        this.users.push({
            id: uuidv4(),
            username,
            password: hashedPassword,
            firstName,
            lastName
        })
        return true
    }

    // login user
    async loginUser(details: Omit<User, 'id' | 'firstName' | 'lastName'>){
        const {username,password} = details;
        const foundUser = this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
        if(!foundUser) return null;
        const isMatch = await bcrypt.compare(password,foundUser.password);
        if(!isMatch) return null;
        return foundUser;
    }

    // find user by username
    findUserByUsername(username: string){
        const foundUser = this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
        if(!foundUser) return false;
        return foundUser;
    }
}

export default new UserModel;