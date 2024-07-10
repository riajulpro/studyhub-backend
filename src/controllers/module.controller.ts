import { Request, Response } from "express";
import Module from "../models/module.model";
import sendResponse from "../utils/sendResponse";
import mongoose from "mongoose";
import Lesson from "../models/lesson.model";

export const createModule = async (req: Request, res: Response) => {
  try {
    const previousModule = await Module.findOne({ name: req.body.name });

    if (previousModule) {
      return sendResponse(res, {
        statusCode: 400,
        message: "This module is already exist!",
        data: null,
        success: false,
      });
    }
    const module = new Module(req.body);
    const savedModule = await module.save();
    sendResponse(res, {
      message: "Module successfully created!",
      data: savedModule,
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

export const getAllModules = async (req: Request, res: Response) => {
  try {
    const modules = await Module.find().populate("lessons");

    sendResponse(res, {
      message: "Module successfully retrieved!",
      data: modules,
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

export const getOneModule = async (req: Request, res: Response) => {
  try {
    const module = await Module.findById(req.params.id).populate("lessons");

    if (!module) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found!" });
    }
    sendResponse(res, {
      message: "Module successfully retrieved!",
      data: module,
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

export const updateModule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, lessons } = req.body;

  try {
    let module = await Module.findById(id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    if (name) {
      module.name = name;
    }

    if (lessons && lessons.length > 0) {
      for (const lessonId of lessons) {
        if (!module.lessons.includes(lessonId)) {
          if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({
              success: false,
              message: `Invalid lesson ID: ${lessonId}`,
            });
          }

          const lessonExists = await Lesson.findById(lessonId);
          if (!lessonExists) {
            return res.status(404).json({
              success: false,
              message: `Lesson not found: ${lessonId}`,
            });
          }

          module.lessons.push(lessonId);
        }
      }
    }

    await module.save();

    res.status(200).json({
      message: "Module updated successfully",
      data: module,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);

    if (!module) {
      return res.status(404).send();
    }

    sendResponse(res, {
      message: "Module successfully deleted!",
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
