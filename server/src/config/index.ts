import { Sequelize } from "sequelize";
import {config} from 'dotenv';
import twilio from 'twilio';

//sequelize connection
config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
export const twilioNumber = process.env.TWILIO_NO;
export const client = twilio(accountSid, authToken);

export const clientId = process.env.SMTP_CLIENT_ID;
export const clientSecret = process.env.SMTP_CLIENT_SECRET;
export const refreshToken = process.env.REFRESH_TOKEN;
export const accessToken = process.env.ACCESS_TOKEN;
export const gmailUser = process.env.GMAIL_USER as string;
export const appSecret = process.env.APP_SECRET as string;


export const db = new Sequelize("app", "", "", {
  storage: "./food.sqlite",
  dialect: "sqlite",
  logging: false,
});