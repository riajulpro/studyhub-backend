"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set storage engine
const storage = multer_1.default.diskStorage({
    destination: "public/", // Store files in the "public" directory
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path_1.default.extname(file.originalname));
    },
});
// Initialize upload variable
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10000000 }, // Set file size limit (e.g., 10MB)
    fileFilter: (req, file, cb) => {
        // Allow any file type
        cb(null, true);
    },
});
exports.default = upload;
