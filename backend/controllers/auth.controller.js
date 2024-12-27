const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

 const signupController = async (req, res, next) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = new User({ username, email, password: hashedPassword });
  try {
    await user.save();
    return res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    next(error);
  }
};

 const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "Email does not exist" });
  }
  try {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Password" });
    }
    const { password: pass, ...rest } = user._doc;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, message: "Login successful", user: rest });
  } catch (error) {
    next(error);
  }
};

 const googleAuthController = async (req, res, next) => {
  const { username, email, photo } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = user._doc;
    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, message: "Login successful", user: rest });
  } else {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, photo });
    try {
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: pass, ...rest } = newUser._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json({ success: true, message: "Login successful", user: rest });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = {
  signinController,
  signupController,
  googleAuthController
};