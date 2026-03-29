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
exports.mailService = void 0;
const config_1 = __importDefault(require("../config"));
const mail_config_1 = require("./mail.config");
const AuthTemplates_1 = require("./Templates/AuthTemplates");
exports.mailService = {
    sendEmail: (to, otp, subject) => __awaiter(void 0, void 0, void 0, function* () {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date());
        let html;
        html = AuthTemplates_1.AuthTemplates.otp(otp, formattedDate);
        const res = yield mail_config_1.transporter.sendMail({
            from: `${config_1.default.smtp.name} <${config_1.default.smtp.email_from}>`,
            to,
            subject,
            html,
        });
        return res;
    }),
};
