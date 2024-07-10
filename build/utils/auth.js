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
exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const isAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getToken = req.header("Authorization");
        if (!getToken)
            return res
                .status(400)
                .json({ message: "Invalid Authentication.", success: false });
        const token = getToken.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded)
            return res.json({ message: "Invalid Authentication.", success: false });
        const user = yield userModel_1.default
            .findOne({ _id: (_a = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _a === void 0 ? void 0 : _a._id })
            .select("-password");
        if (!user)
            return res
                .status(400)
                .json({ message: "User does not exist.", success: false });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;