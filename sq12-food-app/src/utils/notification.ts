import {
  accountSid,
  authToken,
  fromAdminPhone,
  GMAIL_USER,
  GMAIL_PASS,
  FromAdminMail,
  userSubject,
} from "../config";
import nodemailer from "nodemailer";

export const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date();

  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    to: toPhoneNumber,
    from: fromAdminPhone,
  });
  return response;
};

let transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendmail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html,
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const emailHtml = (otp:number):string=>{
   const temp= `
     <div style="max-width:700px;font-size:110%; border:10px solid #ddd; padding:50px 20px; margin:auto;">
     <h2 style="text-transform:uppercase; text-align:center; color:teal;">
      Welcome to Food Kosi store
     </h2>
     <p>Hi there, your otp is ${otp}, it will expire in 30mins</p>
     </div>
   `
   return temp;
}

