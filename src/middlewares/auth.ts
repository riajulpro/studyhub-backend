import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const isAuthenticatedUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const getToken = req.header("Authorization");

    if (!getToken)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Authentication." });

    const token = getToken.split(" ")[1];

    if (!token) {
      return res.status(204).send({
        message: "No token",
        success: false,
      });
    }
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Authentication." });

    const user = await User.findOne({ _id: decoded?.user?._id }).select(
      "-password"
    );

    if (!user) return res.status(400).json({ message: "User does not exist." });

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user.isAdmin;

    console.log(req.user);

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access!",
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
