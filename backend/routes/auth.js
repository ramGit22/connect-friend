import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
const router = express.Router();
  
//Register endpoint
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

//Login endpoint
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password, //password from the request
      user.password //password from the database
    );
    !validPassword && res.status(400).json("wrong password");
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
export default router;
