"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lesson_controller_1 = require("../controllers/lesson.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.isAuthenticatedUser, auth_1.isAdmin, lesson_controller_1.createLesson);
router.get("/get/all", auth_1.isAuthenticatedUser, lesson_controller_1.getAllLessons);
router.get("/get/:id", auth_1.isAuthenticatedUser, lesson_controller_1.getOneLesson);
router.patch("/update/:id", auth_1.isAuthenticatedUser, auth_1.isAdmin, lesson_controller_1.updateLesson);
router.delete("/delete/:id", auth_1.isAuthenticatedUser, auth_1.isAdmin, lesson_controller_1.deleteLesson);
exports.default = router;
