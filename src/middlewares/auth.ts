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
        .json({ success: false, message: "Invalid Authentication." });

    // const token = getToken.split(" ")[1];
    const token = getToken.split(" ")[1];

    if (!token) {
      return res.status(204).send({
        message: "No token",
        success: false,
      });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
console.log(decoded);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Authentication." });

    const user = await userModel
      .findOne({ _id: decoded?.user?._id })
      .select("-password");
    if (!user) return res.status(400).json({ message: "User does not exist." });

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
