import { accessToken, client,clientId,clientSecret,gmailUser,refreshToken,twilioNumber } from "../config";
import nodemailer from "nodemailer";

export const generateOtp = ()=>{
    const otp = Math.floor(Math.random() * 100000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (60*60*1000))
    return {otp, expiry}
}

export const sendOTP = async (otp:number, userPhoneNumber:string) => {

    const response = await client.messages
    .create({
        body: `This is your otp: ${otp}`, 
        from: twilioNumber, 
        to: userPhoneNumber
    })

    return response;
}

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        type: "oauth2",
        user: gmailUser,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
    },
    tls: {
        rejectUnauthorized:false
    }
})

export const emailHtml = (otp:number):string => {

    let response = `

    <div style="max-width:700px; margin:auto; border:10px solid #ddd;

    padding:50px 20px; font-size:110%">

    <h2 style="text-align:center; text-transform:uppercase; color:teal;">

    Welcome to Shoprite

    </h2>

    <p> Hi there, your otp is ${otp} </p>

    </div>  

    `

    return response

}

export const mailSender = async(userEmail:string, otp:number, html:string) =>{

    try {
        let info = await transporter.sendMail({
            from:'admin@localhost',
            to:userEmail,
            subject:'VERIFICATION MESSAGE',
            // text:`Your otp is ${otp}`,
            html: html,
        });
        
        transporter.sendMail(info, err => {
            if(err){
            return console.log(err)
            }
            console.log('Email sent successfully.')
        })
    } catch (error) {
        console.error(error)
    }
}

