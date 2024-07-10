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
exports.deleteLesson = exports.updateLesson = exports.getOneLesson = exports.getAllLessons = exports.createLesson = void 0;
const lesson_model_1 = __importDefault(require("../models/lesson.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const createLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const previousLesson = yield lesson_model_1.default.findOne({ name: req.body.name });
        if (previousLesson) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 400,
                message: "This lesson is already exist!",
                data: null,
                success: false,
            });
        }
        const lesson = new lesson_model_1.default(req.body);
        const savedLesson = yield lesson.save();
        (0, sendResponse_1.default)(res, {
            message: "Lesson successfully created!",
            data: savedLesson,
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
exports.createLesson = createLesson;
const getAllLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessons = yield lesson_model_1.default.find();
        (0, sendResponse_1.default)(res, {
            message: "Lesson successfully retrieved!",
            data: lessons,
            success: true,
            statusCode: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAllLessons = getAllLessons;
const getOneLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = yield lesson_model_1.default.findById(req.params.id);
        if (!lesson) {
            return (0, sendResponse_1.default)(res, {
                message: "Lesson not found!",
                data: null,
                success: false,
                statusCode: 404,
            });
        }
        (0, sendResponse_1.default)(res, {
            message: "Lesson successfully retrieved!",
            data: lesson,
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
exports.getOneLesson = getOneLesson;
const updateLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, questions } = req.body;
    try {
        let lesson = yield lesson_model_1.default.findById(id);
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
                const duplicate = lesson.questions.some((existingQuestion) => existingQuestion.questionText === newQuestion.questionText);
                if (!duplicate) {
                    lesson.questions.push(newQuestion);
                }
            }
        }
        yield lesson.save();
        res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            data: lesson,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateLesson = updateLesson;
const deleteLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = yield lesson_model_1.default.findByIdAndDelete(req.params.id);
        if (!lesson) {
            return (0, sendResponse_1.default)(res, {
                message: "Lesson not found!",
                data: null,
                success: false,
                statusCode: 404,
            });
        }
        (0, sendResponse_1.default)(res, {
            message: "Lesson successfully deleted!",
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
exports.deleteLesson = deleteLesson;
