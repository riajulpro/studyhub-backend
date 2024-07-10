"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyFile = void 0;
const fs_1 = __importDefault(require("fs"));
const destroyFile = (filePath) => {
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        }
        else {
            console.log(`File ${filePath} deleted successfully`);
        }
    });
};
exports.destroyFile = destroyFile;
exports.default = exports.destroyFile;
