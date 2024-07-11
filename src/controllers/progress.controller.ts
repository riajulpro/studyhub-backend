import { Request, Response } from "express";

import { JwtPayload } from "jsonwebtoken";
import CompletedLesson from "../models/completedLesson.model";
import CompletedModule from "../models/completedModule";
import Lesson from "../models/lesson.model";
import Module from "../models/module.model";
import { updateUserProgress } from "../utils/progressHandler";
import sendResponse from "../utils/sendResponse";

// coded by riajul
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

export const updateUserLessonProgress = async (req: Request, res: Response) => {
  try {
    const { moduleId, lessonId } = req.body;

    const decoded = req.user as JwtPayload;
    const userId = decoded._id;

    if (!userId || !moduleId || !lessonId) {
      return res.status(404).json({
        success: false,
        message: "You must provide the userId, moduleId and lessonId!",
      });
    }

    const isModuleFound = await Module.findById(moduleId);
    if (!isModuleFound) {
      return sendResponse(res, {
        data: null,
        message: "module not found",
        success: false,
        statusCode: 404,
      });
    }
    const isLessonFound = await Lesson.findById(lessonId);
    if (!isLessonFound) {
      return sendResponse(res, {
        data: null,
        message: "Lesson not found",
        success: false,
        statusCode: 404,
      });
    }

    const payload = {
      module: moduleId,
      lesson: lessonId,
      user: userId,
    };

    const completeLesson = await CompletedLesson.create(payload);

    return sendResponse(res, {
      statusCode: 201,
      message: "Lesson Progress successfully updated!",
      success: true,
      data: completeLesson,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateUserModuleProgress = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.body;

    const decoded = req.user;
    const user = req.user as JwtPayload;

    if (!moduleId) {
      return res.status(404).json({
        success: false,
        message: "You must provide the  moduleId!",
      });
    }

    const isModuleFound = await Module.findById(moduleId);
    if (!isModuleFound) {
      return sendResponse(res, {
        data: null,
        message: "module not found",
        success: false,
        statusCode: 404,
      });
    }

    const payload = {
      module: moduleId,
      user: user._id,
    };

    const completeLesson = await CompletedModule.create(payload);

    return sendResponse(res, {
      statusCode: 201,
      message: "Module Progress successfully updated!",
      success: true,
      data: completeLesson,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getUserModuleProgress = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;

    const result = await CompletedModule.find({ user: user._id });

    const response = result.length
      ? result.map(({ module }) => module.toString())
      : [];

    return sendResponse(res, {
      statusCode: 201,
      message: "Module Progress get successfully!",
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
export const getUserLessonProgress = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    console.log(user);

    const result = await CompletedLesson.find({ user: user._id });
    const response = result.length
      ? result.map(({ lesson }) => lesson.toString())
      : [];
    return sendResponse(res, {
      statusCode: 201,
      message: "Lesson get successfully!",
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
