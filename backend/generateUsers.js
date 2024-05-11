import User from "./model/userModel.js";
import Posts from "./model/postModel.js";
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/campco', { serverSelectionTimeoutMS: 30000 });

const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `${randomString}@anits.edu.in`;
};

const generateRandomUsername = () => {
    const randomString = Math.random().toString(36).substring(7);
    return `${randomString}`;
};

const createUser = async () => {
    const email = generateRandomEmail();
    const name = generateRandomUsername();
    const emailDomain = 'anist.edu.in';
    
    try {
        const newUser = new User({ name, email, emailDomain });
        await newUser.save();
        
        // Generate post for the user
        await createPost(newUser._id, `Introduction post for ${name}`);
        
    } catch (error) {
        console.error("Error creating user:", error);
    }
};

const createPost = async (userId, postContent) => {
    try {
        const newPost = new Posts({ user: userId, posts: postContent });
        await newPost.save();
    } catch (error) {
        console.error("Error creating post:", error);
    }
};

const generateUsers = async () => {
    try {
        for (let i = 0; i < 10; i++) {
            await createUser();
        }
        console.log("Users and posts created successfully.");
    } catch (error) {
        console.error("Error generating users and posts:", error);
    }
};

generateUsers();
