"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.appSecret = exports.gmailUser = exports.accessToken = exports.refreshToken = exports.clientSecret = exports.clientId = exports.client = exports.twilioNumber = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = require("dotenv");
const twilio_1 = __importDefault(require("twilio"));
//sequelize connection
(0, dotenv_1.config)();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
exports.twilioNumber = process.env.TWILIO_NO;
exports.client = (0, twilio_1.default)(accountSid, authToken);
exports.clientId = process.env.SMTP_CLIENT_ID;
exports.clientSecret = process.env.SMTP_CLIENT_SECRET;
exports.refreshToken = process.env.REFRESH_TOKEN;
exports.accessToken = process.env.ACCESS_TOKEN;
exports.gmailUser = process.env.GMAIL_USER;
exports.appSecret = process.env.APP_SECRET;
exports.db = new sequelize_1.Sequelize("app", "", "", {
    storage: "./food.sqlite",
    dialect: "sqlite",
    logging: false,
});
