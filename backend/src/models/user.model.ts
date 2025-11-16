import { User } from "../types/user";
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

class UserModel {
    private users: User[] = [];
    // Create a new user
    async createUser(newUser: Omit<User, 'id'>){
        const {username,password,firstName,lastName, profileImage, occupation} = newUser;
        const foundIndex  = this.users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
        if(foundIndex !== -1) return false;
        const hashedPassword = await bcrypt.hash(password,12);
        this.users.push({
            id: uuidv4(),
            username,
            password: hashedPassword,
            firstName,
            lastName,
            profileImage: profileImage || '',
            occupation: occupation || ''

        })
        return true
    }

    // login user
    async loginUser(details: Omit<User, 'id' | 'firstName' | 'lastName'| 'profileImage' | 'occupation'>){
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

    // update user details
    async updateUserProfile(username: string, updates: { profileImage?: string; occupation?: string }) {
        const foundIndex = this.users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
        if (foundIndex === -1) return null;

        if (updates.profileImage !== undefined) {
            this.users[foundIndex].profileImage = updates.profileImage;
        }
        if (updates.occupation !== undefined) {
            this.users[foundIndex].occupation = updates.occupation;
        }

        return this.users[foundIndex];
    }
}

export default new UserModel;