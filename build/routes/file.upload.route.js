"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = require("../controllers/file.controller");
const fileUpload_1 = __importDefault(require("../utils/fileUpload"));
const router = express_1.default.Router();
router.post("/upload", fileUpload_1.default.single("file"), file_controller_1.fileUpload);
router.delete("/delete/:fileName", file_controller_1.deleteFile);
exports.default = router;
