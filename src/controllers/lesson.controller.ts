import { Request, Response } from "express";
import Lesson from "../models/lesson.model";
import sendResponse from "../utils/sendResponse";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const previousLesson = await Lesson.findOne({ name: req.body.name });

    if (previousLesson) {
      return sendResponse(res, {
        statusCode: 400,
        message: "This lesson is already exist!",
        data: null,
        success: false,
      });
    }
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
  const { id } = req.params;
  const { name, questions } = req.body;

  try {
    let lesson = await Lesson.findById(id);

    if (!lesson) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found" });
    }

    if (name) {
      lesson.name = name;
    }

    // Check and push new questions
    if (questions && questions.length > 0) {
      for (const newQuestion of questions) {
        const duplicate = lesson.questions.some(
          (existingQuestion) =>
            existingQuestion.questionText === newQuestion.questionText
        );

        if (!duplicate) {
          lesson.questions.push(newQuestion);
        }
      }
    }

    await lesson.save();

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
