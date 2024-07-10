import axios from "axios";
import bycript from "bcryptjs";
import crypto from "crypto";
import { Request, Response } from "express";
import path from "path";
import { OtpTemplate } from "../clients/template/otpTemplat";
import userModel from "../models/userModel";
import { catchAsyncError } from "../utils/catchAsyncError";
import { generateOtp } from "../utils/gtOtp";

import { createAcessToken, createRefreshToken } from "../utils/jwtToken";
import sendMessage from "../utils/sendMessage";
export const authStateChange = catchAsyncError(async (req, res, next) => {
  const { user } = req;

  res.status(200).json({
    success: true,
    message: "Authenticate user",
    user,
  });
});

// register user
export const register = catchAsyncError(async (req, res, next) => {
  const { body } = req;
  let otp = 0;
  const isExist = await userModel.findOne({ email: body.email });

  if (isExist) {
    return res.json({
      success: false,
      message: `User already exist in ${body.email}`,
    });
  }

  const hashPass = await bycript.hash(body.password, 15);

  const result = await userModel.create({
    ...body,
    otp: otp,
    password: hashPass,
    passwordHistory: [hashPass],
  });
  const { password, otp: OTP, ...user } = result.toObject();

  const tokenPayload = {
    _id: result._id,
    email: result.email,
  };

  const accessToken = createAcessToken(tokenPayload, "7d");

  res.status(200).json({
    success: true,
    message: "User created successfully",
    data: user,
    accessToken,
  });
});

// login user
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: `User not found for ${email}` });
  }

  if (!password) {
    return res.json({
      message: "no password found",
      data: null,
      success: false,
    });
  }

  const isMatchedPass = await bycript.compare(
    password,
    user?.password as string
  );

  if (!isMatchedPass) {
    return res
      .status(203)
      .json({ message: "Wrong password", success: false, data: null });
  }
  const tokenPayload = {
    _id: user._id,
    email: user.email,
  };
  const accessToken = createAcessToken(tokenPayload, "7d");
  const refreshToken = createRefreshToken(tokenPayload);

  const { password: pass, otp: OTP, ...resUser } = user.toObject();

  res.json({
    success: true,
    accessToken,
    refreshToken,
    data: resUser,
  });
});

// varify otp
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { otp: reqOtp, email } = req.body;
  if (!reqOtp || !email) {
    return res.json({
      message: "email and OTP both are required",
      success: false,
    });
  }
  const otp = parseInt(reqOtp);

  const user = await userModel.findOne({ otp, email });
  if (!user) {
    return res.json({ success: false, message: "Invalid OTP" });
  }

  const currentTime = new Date();
  if (user.expireAt && user.expireAt < currentTime) {
    return res.status(401).json({
      message: "OTP expired",
      success: false,
      sessionExpired: true,
    });
  }

  const updateUser = await userModel.findOneAndUpdate(
    { email: user.email },
    {
      $set: {
        otp: null,
        isVarify: true,
      },
    }
  );

  const tokenPayload = {
    _id: user._id,
    email: user.email,
  };
  const accessToken = createAcessToken(tokenPayload, "7d");

  res.json({
    success: true,
    message: "User successfuly verified",
    accessToken,
  });
});

// json otp
export const sendOTP = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ message: "Email is required to json otp" });
  }

  // check for user
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.json({
      message: `No user found with this email -> ${email}`,
      success: false,
    });
  }

  let otp = generateOtp();
  let isExistOtp = await userModel.findOne({ otp: otp });

  while (isExistOtp) {
    otp = generateOtp();
    isExistOtp = await userModel.findOne({ otp: otp });
  }

  // Set expiration time for OTP
  const expireAt = new Date();
  expireAt.setMinutes(expireAt.getMinutes() + 5); // Set expiration time to 5 minutes from now

  await userModel.updateOne(
    { email },
    {
      $set: {
        otp: otp,
        expireAt: expireAt, // Set the expiration time
      },
    }
  );

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Verify Your OTP",
    OtpTemplate(otp),
    [
      {
        filename: "image.jpg",
        path: path.join(
          __dirname,

          "..",
          "clients",
          "assets",
          "image1.png"
        ),
        cid: "unique@nodemailer.com", // same cid value as in the html img src
      },
    ]
  );

  res.json({ message: "OTP sent to your email", success: true });
});

// reset password
export const resetPassword = catchAsyncError(async (req: any, res, next) => {
  const { password, oldPassword, email } = req.body;

  const user = req.user;

  if (!password || !oldPassword || !email) {
    return res.json({
      message: "password, oldPassword and email => is required",
    });
  }

  const theUser = await userModel.findOne({ email });

  // check if there no user
  if (!theUser) {
    return res.json({ message: `no user find on ${email}` });
  }

  // check is the email is same or not
  if (theUser.email !== user.email) {
    return res
      .status(403)
      .json({ message: "Email didn't matched=> forbiden access" });
  }

  // varify old password
  const isOk = await bycript.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return res.json({ message: "password didn't matched", success: false });
  }

  // create new hash password
  const newPass = await bycript.hash(password, 15);

  // update the new
  const updatePassword = await userModel.findOneAndUpdate(
    { email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// forgot-password controller
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "No user found with this email!" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 300000;

  await user.save();

  const url =
    process.env.FRONTEND_BASE_URL || "https://nexusnova-frontend.vercel.app";

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Reset your password - Nexusnova",

    `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
            <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px;">
            <p>Hello,${user?.firstName || ""}</p>
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${url}/reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thanks,</p>
            <p>Nexusnova</p>
        </div>
        <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
            <p style="margin: 0;">&copy; 2024 Nexusnova. All rights reserved.</p>
        </div>
    </div>
</div>`
  );

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
  });
});
// Resetting new password
export const recoverPassword = catchAsyncError(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Password reset session exipred. Try again" });
  }
  const hashedPassword = await bycript.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password has been successfully reset" });
});


