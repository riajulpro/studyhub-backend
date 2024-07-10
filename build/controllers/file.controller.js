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
exports.deleteFile = exports.fileUpload = void 0;
const deleteFile_1 = __importDefault(require("../utils/deleteFile"));
const fileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const serverUrl = `${req.protocol}://${req.get("host")}`;
    res.send({ url: serverUrl + "/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) });
});
exports.fileUpload = fileUpload;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName } = req.params;
    //file-1715154024306-7524-1.pdf
    const pathname = `public/${fileName}`;
    console.log(pathname);
    (0, deleteFile_1.default)(pathname);
    res.send({ message: "delete successfull" });
});
exports.deleteFile = deleteFile;
