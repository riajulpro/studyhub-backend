"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const QuestionSchema = new mongoose_1.default.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [
        {
            type: String,
            required: true,
        },
    ],
    correctAnswer: {
        type: String,
        required: true,
    },
});
const LessonSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    questions: [QuestionSchema],
});
const Lesson = mongoose_1.default.model("Lesson", LessonSchema);
exports.default = Lesson;
