"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const module_controller_1 = require("../controllers/module.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/create", auth_1.isAuthenticatedUser, auth_1.isAdmin, module_controller_1.createModule);
router.get("/get/all", auth_1.isAuthenticatedUser, module_controller_1.getAllModules);
router.get("/get/:id", auth_1.isAuthenticatedUser, module_controller_1.getOneModule);
router.patch("/update/:id", auth_1.isAuthenticatedUser, auth_1.isAdmin, module_controller_1.updateModule);
router.delete("/delete/:id", auth_1.isAuthenticatedUser, auth_1.isAdmin, module_controller_1.deleteModule);
exports.default = router;
