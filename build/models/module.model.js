"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ModuleSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    lessons: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Lesson",
        },
    ],
});
const Module = mongoose_1.default.model("Module", ModuleSchema);
exports.default = Module;