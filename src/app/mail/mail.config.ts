import nodemailer from "nodemailer";
import config from "../config";


export const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: Number(config.smtp.port) || 587,
    secure: Number(config.smtp.port) === 465,
    auth: {
        user: config.smtp.email,
        pass: config.smtp.pass,
    },
} as any);