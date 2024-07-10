import { Request, Response } from "express";
import Module from "../models/module.model";
import sendResponse from "../utils/sendResponse";

export const createModule = async (req: Request, res: Response) => {
  try {
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
      return res.status(404).send();
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
  const updates: any = Object.keys(req.body);
  const allowedUpdates = ["name", "lessons"];
  const isValidOperation = updates.every((update: any) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return sendResponse(res, {
      message: "Invalid updates!",
      data: null,
      success: false,
      statusCode: 400,
    });
  }

  try {
    const module: any = await Module.findById(req.params.id);

    if (!module) {
      return sendResponse(res, {
        message: "Module not found!",
        data: null,
        success: false,
        statusCode: 404,
      });
    }

    updates.forEach((update: any) => (module[update] = req.body[update]));
    const updatedData = await module.save();

    sendResponse(res, {
      message: "Module successfully updated!",
      data: updatedData,
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
