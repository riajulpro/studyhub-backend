import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import { catchAsyncError } from "../utils/catchAsyncError";

import {
  createAcessToken,
  createForgotPasswordToken,
  createRefreshToken,
} from "../utils/jwtToken";
import sendMessage from "../utils/sendMessage";
import sendResponse from "../utils/sendResponse";
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
  const { password, ...user } = result.toObject();

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

  const { password: pass, ...resUser } = user.toObject();

  res.json({
    success: true,
    accessToken,
    refreshToken,
    data: resUser,
  });
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

  const token = createForgotPasswordToken(user.email);

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
  let decodedPayload: any = "";
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET as string);
    decodedPayload = decoded;
  } catch {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      data: null,
      message: "Ivalid authentication, try again",
    });
  }

  const email = decodedPayload.email as string;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Password reset session exipred. Try again" });
  }
  const hashedPassword = await bycript.hash(password, 10);

  user.password = hashedPassword;

  await user.save();

  res
    .status(200)
    .json({
      success: true,
      message: "Password has been successfully reset",
      data: null,
    });
});
