import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (req, res) => {
  try {

    const { name, email, contactNumber } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();

    user = new User({
      name,
      email,
      contactNumber,
      otp
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      otp
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    user.otp = otp;

    await user.save();

    res.json({
      message: "OTP sent",
      otp
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

export const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.otp = null;

    await user.save();

    res.json({
      message: "Login successful",
      token
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};