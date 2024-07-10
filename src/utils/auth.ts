import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";

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
        .json({ message: "Invalid Authentication.", success: false });

    const token = getToken.split(" ")[1];
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    );

    if (!decoded)
      return res.json({ message: "Invalid Authentication.", success: false });

    const user = await userModel
      .findOne({ _id: decoded?.user?._id })
      .select("-password");
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};
