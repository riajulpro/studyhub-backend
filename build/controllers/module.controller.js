"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModule = exports.updateModule = exports.getOneModule = exports.getAllModules = exports.createModule = void 0;
const module_model_1 = __importDefault(require("../models/module.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const mongoose_1 = __importDefault(require("mongoose"));
const lesson_model_1 = __importDefault(require("../models/lesson.model"));
const createModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const previousModule = yield module_model_1.default.findOne({ name: req.body.name });
        if (previousModule) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                message: "This module is already exist!",
                data: null,
                success: false,
            });
        }
        const module = new module_model_1.default(req.body);
        const savedModule = yield module.save();
        (0, sendResponse_1.default)(res, {
            message: "Module successfully created!",
            data: savedModule,
            success: true,
            statusCode: 201,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createModule = createModule;
const getAllModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modules = yield module_model_1.default.find().populate("lessons");
        (0, sendResponse_1.default)(res, {
            message: "Module successfully retrieved!",
            data: modules,
            success: true,
            statusCode: 201,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAllModules = getAllModules;
const getOneModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const module = yield module_model_1.default.findById(req.params.id).populate("lessons");
        if (!module) {
            return res
                .status(404)
                .json({ success: false, message: "Module not found!" });
        }
        (0, sendResponse_1.default)(res, {
            message: "Module successfully retrieved!",
            data: module,
            success: true,
            statusCode: 201,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getOneModule = getOneModule;
const updateModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, lessons } = req.body;
    try {
        let module = yield module_model_1.default.findById(id);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }
        if (name) {
            module.name = name;
        }
        if (lessons && lessons.length > 0) {
            for (const lessonId of lessons) {
                if (!module.lessons.includes(lessonId)) {
                    if (!mongoose_1.default.Types.ObjectId.isValid(lessonId)) {
                        return res.status(400).json({
                            success: false,
                            message: `Invalid lesson ID: ${lessonId}`,
                        });
                    }
                    const lessonExists = yield lesson_model_1.default.findById(lessonId);
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
        yield module.save();
        res.status(200).json({
            message: "Module updated successfully",
            data: module,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
});
exports.updateModule = updateModule;
const deleteModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const module = yield module_model_1.default.findByIdAndDelete(req.params.id);
        if (!module) {
            return res.status(404).send();
        }
        (0, sendResponse_1.default)(res, {
            message: "Module successfully deleted!",
            data: null,
            success: true,
            statusCode: 201,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deleteModule = deleteModule;
