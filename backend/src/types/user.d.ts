export interface User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
    occupation?: string;
    posts?: string[];
}
export interface BlogPost{
    id: string;
    title: string;
    summary?: string;
    content: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    username: string;
}