"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactShema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    enquiryType: {
        type: String,
        required: true,
    },
    preferredContactMethod: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    message: {
        type: String,
        required: true,
    },
    // how_did_you_hear_about_us
    howDidYouHear: {
        type: String,
        required: true,
    },
});
const Contact = mongoose_1.default.model("Contact", contactShema);
exports.default = Contact;
