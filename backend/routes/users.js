import express from "express";
const router = express.Router()
import bcrypt from "bcrypt";
import User from "../models/User.js";

// update user
router.put("/:id", async (req, res) => {
    if (req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(503).json(err);
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });
  
//delete user
router.delete("/:id", async(req, res) =>{
    if(req.body.userId === req.params.id ){
        try {
            await User.findByIdAndDelete(req.params.id)
            res.send("User has been deleted")
        } catch (error) {
            res.send("you can delete only your account")
        }}    
})

//get a user by id
router.get("/:id", async(req, res) =>{
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.send(other)
    } catch (error) {
    res.send("user not found")
    }}
)

//follow a user
router.put("/:id/follow", async(req,res) => {
  if(req.body.userId !== req.params.id){
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId)
      if(!user.followers.includes(req.body.userId))
          {
            await User.updateOne({$push: {followers: req.body.userId}})
            await currentUser.updateOne({$push:{followings:req.params.id}})
          res.send("user has been followed")
          }  else{
            res.send("you are already following this user")
          }
              
    } catch (error) {
    res.send(error)
    }
  
  } else {
    res.send("You can't follow yourself")
  }
  }
)

//unfollow a user
router.put("/:id/unfollow",async(req,res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.send("user has been unfollowed");
      } else {
        res.send("you dont follow this user");
      }
    } catch (err) {
      res.send(err);
    }
  } else {
    res.send("you cant unfollow yourself");
  }
});

export default router;


 