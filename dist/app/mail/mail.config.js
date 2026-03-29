"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
exports.transporter = nodemailer_1.default.createTransport({
    host: config_1.default.smtp.host,
    port: config_1.default.smtp.port,
    secure: false,
    auth: {
        user: config_1.default.smtp.email,
        pass: config_1.default.smtp.pass,
    },
});
