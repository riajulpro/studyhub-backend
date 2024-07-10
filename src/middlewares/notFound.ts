import { Request, Response } from "express";

export const notFound = async (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedPath: req.originalUrl,
    method: req.method,
  });
};
