import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (call, callback) => {

  try {

    const { name, email, contactNumber } = call.request;

    let user = await User.findOne({ email });

    if (user) {
      return callback(null, { message: "User already exists" });
    }

    const otp = generateOtp();

    user = new User({
      name,
      email,
      contactNumber,
      otp
    });

    await user.save();

    callback(null, {
      message: "User registered",
      token: ""
    });

  } catch (error) {

    callback(error);

  }

};

export const login = async (call, callback) => {

  try {

    const { email } = call.request;

    const user = await User.findOne({ email });

    if (!user) {
      return callback(null, { message: "User not found" });
    }

    const otp = generateOtp();

    user.otp = otp;

    await user.save();

    callback(null, {
      message: "OTP generated",
      otp
    });

  } catch (error) {

    callback(error);

  }

};

export const verifyOtp = async (call, callback) => {

  try {

    const { email, otp } = call.request;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return callback(null, { message: "Invalid OTP" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.otp = null;

    await user.save();

    callback(null, {
      message: "Login successful",
      token
    });

  } catch (error) {

    callback(error);

  }

};