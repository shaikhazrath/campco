import User from "./model/userModel.js";
import mongoose from 'mongoose'; 
mongoose.connect('mongodb://localhost:27017/UZ', {
  serverSelectionTimeoutMS: 30000, 
});
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
  const newUser = new User({  name, email, emailDomain});
  await newUser.save();
};

// Function to generate 1000 users
const generateUsers = async () => {
  try {
      for (let i = 0; i < 10; i++) {
          await createUser();
      }
      console.log("Users created successfully.");
      exit();
  } catch (error) {
      console.error("Error generating users:", error);
  }
};

generateUsers();