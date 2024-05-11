import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import Posts from "../model/postModel.js";
const router = express.Router();

router.get("/userPosts", verifyToken, async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.user });
    res.json(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/userPosts/:id", verifyToken, async (req, res) => {
  try {
    const id = req.params.id
    const posts = await Posts.find({ user: id });
    res.json(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.post("/uploadPosts", verifyToken, async (req, res) => {
    try {
      const  posts  = req.body.post;
      console.log(posts)
      const newPost = new Posts({
          user: req.user,
          posts,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  });



  router.delete("/deletePost/:id", verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Posts.findOneAndDelete({ _id: postId, user: req.user });
        if (!post) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Posts.find({ user: { $ne: req.user }}).populate('user', 'name profileImage');;
    res.json(posts);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
