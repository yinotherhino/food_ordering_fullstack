"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailSender = exports.emailHtml = exports.sendOTP = exports.generateOtp = void 0;
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateOtp = () => {
    const otp = Math.floor(Math.random() * 100000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (60 * 60 * 1000));
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const sendOTP = async (otp, userPhoneNumber) => {
    const response = await config_1.client.messages
        .create({
        body: `This is your otp: ${otp}`,
        from: config_1.twilioNumber,
        to: userPhoneNumber
    });
    return response;
};
exports.sendOTP = sendOTP;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        type: "oauth2",
        user: config_1.gmailUser,
        clientId: config_1.clientId,
        clientSecret: config_1.clientSecret,
        refreshToken: config_1.refreshToken,
        accessToken: config_1.accessToken,
    },
    tls: {
        rejectUnauthorized: false
    }
});
const emailHtml = (otp) => {
    let response = `

    <div style="max-width:700px; margin:auto; border:10px solid #ddd;

    padding:50px 20px; font-size:110%">

    <h2 style="text-align:center; text-transform:uppercase; color:teal;">

    Welcome to Shoprite

    </h2>

    <p> Hi there, your otp is ${otp} </p>

    </div>  

    `;
    return response;
};
exports.emailHtml = emailHtml;
const mailSender = async (userEmail, otp, html) => {
    try {
        let info = await transporter.sendMail({
            from: 'admin@localhost',
            to: userEmail,
            subject: 'VERIFICATION MESSAGE',
            // text:`Your otp is ${otp}`,
            html: html,
        });
        transporter.sendMail(info, err => {
            if (err) {
                return console.log(err);
            }
            console.log('Email sent successfully.');
        });
    }
    catch (error) {
        console.error(error);
    }
};
exports.mailSender = mailSender;
