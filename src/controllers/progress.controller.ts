import { Request, Response } from "express";
import { updateUserProgress } from "../utils/progressHandler";
import sendResponse from "../utils/sendResponse";

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

    console.log("pr", response);
    return sendResponse(res, {
      statusCode: 201,
      message: "Progress successfully updated!",
      success: true,
      data: response,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
