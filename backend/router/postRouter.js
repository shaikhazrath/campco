import express from 'express'
import verifyToken from '../middleware/authMiddleware.js';
import Posts from '../model/postModel.js';
const router = express.Router();
router.get('/userPosts',verifyToken, async(req,res)=>{
    try {
        const posts = await Posts.find({user:req.user})
        res.json(posts)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/uploadPosts',verifyToken, async(req,res)=>{
    try {
        const {posts} = req.body;
        console.log(posts)
        res.json(posts)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

export default router