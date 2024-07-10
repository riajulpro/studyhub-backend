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
exports.updateUserProgress = exports.getModuleLessons = void 0;
const module_model_1 = __importDefault(require("../models/module.model"));
const userModel_1 = __importDefault(require("../models/userModel"));
const getModuleLessons = (moduleId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const module = yield module_model_1.default.findById(moduleId).populate("lessons");
        if (!module) {
            throw new Error("Module not found");
        }
        return module.lessons.map((lesson) => lesson._id.toString());
    }
    catch (err) {
        console.error(err);
        throw new Error("Error fetching module lessons");
    }
});
exports.getModuleLessons = getModuleLessons;
const updateUserProgress = (userId, moduleId, lessonId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessonResult = yield userModel_1.default.findByIdAndUpdate(userId, {
            $set: {
                [`progress.${lessonId}`]: true,
            },
        }, { new: true });
        const moduleLessons = yield (0, exports.getModuleLessons)(moduleId);
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const isModuleCompleted = moduleLessons.every((lesson) => user.progress[lesson] === true);
        if (isModuleCompleted) {
            const moduleResult = yield userModel_1.default.findByIdAndUpdate(userId, {
                $set: {
                    [`progress.${moduleId}`]: true,
                },
            }, { new: true });
            console.log("Module completed");
            return moduleResult;
        }
        else {
            console.log("Lesson completed but module not yet completed");
            return lessonResult;
        }
    }
    catch (err) {
        console.error(err);
    }
});
exports.updateUserProgress = updateUserProgress;
