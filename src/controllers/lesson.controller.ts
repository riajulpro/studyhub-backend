import { Request, Response } from "express";
import Lesson from "../models/lesson.model";
import sendResponse from "../utils/sendResponse";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const lesson = new Lesson(req.body);
    const savedLesson = await lesson.save();
    sendResponse(res, {
      message: "Lesson successfully created!",
      data: savedLesson,
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllLessons = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find();

    sendResponse(res, {
      message: "Lesson successfully retrieved!",
      data: lessons,
      success: true,
      statusCode: 200,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOneLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return sendResponse(res, {
        message: "Lesson not found!",
        data: null,
        success: false,
        statusCode: 404,
      });
    }
    sendResponse(res, {
      message: "Lesson successfully retrieved!",
      data: lesson,
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  const updates: any = Object.keys(req.body);
  const allowedUpdates = ["name", "questions"];
  const isValidOperation = updates.every((update: any) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const lesson: any = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).send();
    }

    updates.forEach((update: any) => (lesson[update] = req.body[update]));
    const updatedLesson = await lesson.save();

    sendResponse(res, {
      message: "Lesson successfully updated!",
      data: updatedLesson,
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return sendResponse(res, {
        message: "Lesson not found!",
        data: null,
        success: false,
        statusCode: 404,
      });
    }

    sendResponse(res, {
      message: "Lesson successfully deleted!",
      data: null,
      success: true,
      statusCode: 201,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
