import express from "express";
const router = express.Router();
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import verifyToken from "../middleware/authMiddleware.js";
import Message from "../model/messageModel.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/shopImage' })

router.post("/", async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email,picture } = payload;
    const emailDomain = email.split("@")[1];

    if (emailDomain !== "gmail.com") {
      return res.status(403).json({ message: "Unauthorized: Only @anits.edu.in emails allowed" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, emailDomain,profileImage:picture});
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const responseData = {
      token,
      name,
      message: user.isNew ? 'New user created' : 'User found',
    };
    res.status(201).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/checkauth",verifyToken,(req,res)=>{
  try {
    const message = "user authenticated"
    res.status(200).json({message});
  } catch (error) {
    res.status(400).send(error.message);
  }
})

router.get("/userprofile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const connectedUserIds = user.connectedUsers;
    const connectedUsers = await User.find({ _id: { $in: connectedUserIds } });
    res.status(200).json({ user, connectedUsers });
  } catch (error) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

router.put("/updateProfile", verifyToken, async (req, res) => {
  try {
    const userId = req.user;
      const { name, bio,branch ,pass_out_year} = req.body;
      const updateFields = { name, bio,branch ,pass_out_year};
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get("/othersprofile/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUserId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connectedUsersCount = user.connectedUsers.length;
    let mutualsCount = 0;
    if (user.connectedUsers.includes(currentUserId)) {
      const currentUser = await User.findById(currentUserId);
      mutualsCount = currentUser.connectedUsers.filter(
        id => user.connectedUsers.includes(id)
      ).length;
    }
    let connectionStatus = '';
    if (user.connectedUsers.includes(currentUserId)) {
      connectionStatus = 'connected';
    } else if (user.requested.includes(currentUserId)) {
      connectionStatus = 'acceptRequest';
    } else if (user.requests.includes(currentUserId)) {
      connectionStatus = 'removeRequest';
    }else{
      connectionStatus = "sendRequest"
    }
    const { name, bio, pass_out_year, branch } = user;
    res.status(200).json({
      name,
      bio,
      pass_out_year,
      branch,
      connectedUsersCount,
      mutualsCount,
      connectionStatus
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.get("/findpeople", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const usersToConnect = await User.find({
      _id: { $ne: userId }, 
      requests: { $ne: userId },
      requested: { $ne: userId },
      connectedUsers: { $ne: userId }  
    });
    const currentUser = req.user;
    await currentUser.populate("requests");
    const requests = currentUser.requests;

    res.status(200).json({ usersToConnect, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/sendRequest/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const recipientUser = await User.findById(userId);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient user not found" });
    }
    if (
      currentUser.requests.includes(recipientUser._id) ||
      currentUser.connectedUsers.includes(recipientUser._id) ||
      currentUser.requested.includes(recipientUser._id)
    ) {
      return res
        .status(400)
        .json({ message: "Request already sent to this user" });
    }
    currentUser.requested.push(recipientUser._id);
    recipientUser.requests.push(currentUser._id);
    await currentUser.save();
    await recipientUser.save();
    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.delete("/removeRequest/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const recipientUser = await User.findById(userId);
    if (!recipientUser) {
      return res.status(404).json({ message: "Recipient user not found" });
    }
    // Removing request from currentUser's requested array
    const currentUserIndex = currentUser.requested.indexOf(recipientUser._id);
    if (currentUserIndex !== -1) {
      currentUser.requested.splice(currentUserIndex, 1);
    }

    // Removing request from recipientUser's requests array
    const recipientUserIndex = recipientUser.requests.indexOf(currentUser._id);
    if (recipientUserIndex !== -1) {
      recipientUser.requests.splice(recipientUserIndex, 1);
    }

    await currentUser.save();
    await recipientUser.save();
    res.status(200).json({ message: "Request removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/acceptRequest/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;
    const requestingUser = await User.findById(userId);
    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }
    if (!currentUser.requests.includes(requestingUser._id)) {
      return res
        .status(400)
        .json({ message: "No request found from this user" });
    }
    currentUser.requests = currentUser.requests.filter(
      (id) => id.toString() !== userId
    );
    currentUser.connectedUsers.push(requestingUser._id);
    requestingUser.connectedUsers.push(currentUser._id);
    requestingUser.requested = requestingUser.requested.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    await currentUser.save();
    await requestingUser.save();
    res.status(200).json({ message: "Request accepted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});



router.get("/inbox", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const connectedUserIds = user.connectedUsers;
    const connectedUsers = await User.find({ _id: { $in: connectedUserIds } });
    res.status(200).json(connectedUsers);
  } catch (error) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

router.get("/userChat/:userId", verifyToken, async (req, res) => {
  try {
    const sender = await User.findById(req.user);
    const { userId } = req.params;
    const recipient =  await User.findById(userId)
    const messages = await Message.find({
      $or: [
        { sender: sender._id, recipient: recipient._id },
        { sender: recipient._id, recipient: sender._id },
      ],
    });
    const responseData = {
      messages,
      recipient
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.post("/sendMessage", verifyToken, async (req, res) => {
  try {
    const { recipientId, messageText } = req.body;
    const sender = await User.findById(req.user);
    const recipient = await User.findById(recipientId);
    const newMessage = new Message({
      sender: sender._id,
      recipient: recipient._id,
      message: messageText,
    });
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

export default router;
