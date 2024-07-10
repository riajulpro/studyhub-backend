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
exports.updateProgress = void 0;
const progressHandler_1 = require("../utils/progressHandler");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const updateProgress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, moduleId, lessonId } = req.body;
        console.log(req.body);
        if (!userId || !moduleId || !lessonId) {
            return res.status(404).json({
                success: false,
                message: "You must provide the userId, moduleId and lessonId!",
            });
        }
        const response = yield (0, progressHandler_1.updateUserProgress)(userId, moduleId, lessonId);
        console.log("pr", response);
        return (0, sendResponse_1.default)(res, {
            statusCode: 201,
            message: "Progress successfully updated!",
            success: true,
            data: response,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updateProgress = updateProgress;
