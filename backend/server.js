import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'; 
import UserMannager from './router/userRoute.js';
import Message from './model/messageModel.js';
dotenv.config({ path: './.env' });
import jwt from 'jsonwebtoken';
import User from './model/userModel.js';
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'], 
    credentials: true,
  },
});


io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('A token is required for authentication'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('User not found'));
    }
    socket.user = user;
  } catch (err) {
    return next(new Error('Invalid token'));
  }
  next();
});

io.on('connection', async (socket) => {
  
  try {
    const user = await User.findById(socket.user._id);
    if (user) {
      user.socketId = socket.id;
      user.online = true;
      await user.save();
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }

  socket.on('chat', async (data) => {
    try {
      const { recipientId, messageText } = data;

      const sender = await User.findById(socket.user._id);
      const recipient = await User.findById(recipientId);

      const newMessage = new Message({
        sender: sender._id,
        recipient: recipient._id,
        message: messageText,
      });

      const savedMessage = await newMessage.save();

      const senderSocket = io.sockets.sockets.get(sender.socketId);
      const recipientSocket = io.sockets.sockets.get(recipient.socketId);
      if (senderSocket && sender.online) {
        senderSocket.emit('messageReceived', savedMessage);
      }
      if (recipientSocket && recipient.online) {
        recipientSocket.emit('messageReceived', savedMessage);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', async () => {
    if (socket.user) {
      socket.user.online = false;
      socket.user.socketId = '';
      await socket.user.save();
    }
  });
});


mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/user', UserMannager);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
