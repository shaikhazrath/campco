import express from "express";
const router = express.Router();
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import verifyToken from "../middleware/authMiddleware.js";
import Message from "../model/messageModel.js";
router.post("/", async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email } = payload;
    const emailDomain = email.split("@")[1];

    // if (emailDomain != "anits.edu.in") {
    //   return res
    //     .status(403)
    //     .json({ message: "Unauthorized: Only @anits.edu.in emails allowed" });
    // }
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, emailDomain });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(201).json({ token, name, email });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
});

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

router.get("/othersprofile/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

router.get("/randomuser", verifyToken, async (req, res) => {
  try {
    const count = await User.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const randomUser = await User.findOne({ _id: { $ne: req.user._id } }).skip(
      randomIndex
    );
    if (!randomUser) {
      return res.status(404).json({ message: "No random user found" });
    }
    res.status(200).json(randomUser);
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

router.get("/viewRequests", verifyToken, async (req, res) => {
  try {
    const currentUser = req.user;
    await currentUser.populate("requests");
    const requests = currentUser.requests;
    res.status(200).json(requests);
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
