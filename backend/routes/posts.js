import express from "express";
import Post from "../models/Post.js"

const router = express.Router()

//create post 
router.post("/", (req, res) => {
    const newPost = new Post(req.body)
    newPost.save();
    res.send(newPost)

})

//update post 
router.put("/:id", async(req,res) => {
    const post = await Post.findById(req.params.id)
    if (post.userId === req.body.userId) {
        await post.updateOne({$set:req.body})
        res.send("post updated successfully")
    } else {
        res.send("Post can't be updated")
    }
})


export default router