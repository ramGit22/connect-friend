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

// //Login endpoint
// router.post("/login", async (req, res) => {
//   try {
//     //check if email exists
//     const user = await User.findOne({ email: req.body.email });
//     !user && res.send("user not found");

//     //validate password
//     const validPassword = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     !validPassword && res.send("Wrong password");

//     res.status(200).json(user);
//   } catch (error) {
//     console.log(error);
//   }
// });

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(
      { password: req.body.password },
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

export default router;
