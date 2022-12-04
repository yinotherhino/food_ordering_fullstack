"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.mailSent = exports.transport = exports.onRequestOTP = exports.GenerateOTP = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const express_1 = require("express");
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require("twilio")(config_1.accountSid, config_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
exports.transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: config_1.GMAIL_USER,
        pass: config_1.GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});
//export const sendEmail = ()=>{
//}
const mailSent = async (from, to, subject, html) => {
    try {
        const resonse = await exports.transport.sendMail({
            from: config_1.fromAdminMail, subject: config_1.userSubject, to, html
        });
        return express_1.response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
    <div style="max-width:700px;
    margin:auto;border:10px solid #ddd;
    padding:50px 20px; font-size:110%;
    ">
    <h2 style = "text-align:center;
    text-transform:uppercase; color:teal;">
    Welcome to kevwe food store
    </h2>
    <p>Hi there!,your otp is ${otp}.Just enter this otp to verify your account creation</p>
    </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
