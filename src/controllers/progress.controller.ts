import { Request, Response } from "express";
import { updateUserProgress } from "../utils/progressHandler";

export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { userId, moduleId, lessonId } = req.body;

    console.log(req.body);

    if (!userId || !moduleId || !lessonId) {
      return res.status(404).json({
        success: false,
        message: "You must provide the userId, moduleId and lessonId!",
      });
    }

    const response = await updateUserProgress(userId, moduleId, lessonId);

    console.log(response);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
