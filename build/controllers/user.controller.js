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
exports.updateUserInfo = exports.updatePrivacy = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
// get single user by id
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield userModel_1.default.findOne({ _id: id });
        if (!result) {
            return res.status(404).send({ message: "No user found" });
        }
        res.send(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.getUser = getUser;
// update id based user privacy
const updatePrivacy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { privacy } = req.body;
    try {
        const result = yield userModel_1.default.findByIdAndUpdate(id, { privacy: privacy });
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
    }
});
exports.updatePrivacy = updatePrivacy;
// update user info
const updateUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const body = req.body;
    try {
        delete body.email;
        delete body.password;
        delete body.isVarify;
        const result = yield userModel_1.default.findByIdAndUpdate(id, body);
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateUserInfo = updateUserInfo;
