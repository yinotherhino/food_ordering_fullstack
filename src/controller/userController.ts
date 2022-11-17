import { Request, Response } from "express";
import { emailHtml, generateOtp, mailSender, sendOTP } from "../utils/otp";
import { UserAttributes, UserInstance } from "../model/userModel";
import { generatePassword, generateSalt, generateToken, option, registerSchema, verifyToken } from "../utils/utility";
import { v4 as uuidv4 } from "uuid";
import { config } from 'dotenv';
import { JwtPayload } from "jsonwebtoken";

config();

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirmPassword } = req.body
    const validateResult = registerSchema.validate( req.body, option )

    if(validateResult.error){
      return res.status(400).json({
        Error: validateResult.error.details[0].message
      })
    }
      const {otp, expiry} = generateOtp();
      const salt = await generateSalt();
      const hashedPassword = await generatePassword(password, salt);

      const user = await UserInstance.findOne({
        where: {email: email}
      })

      if(!user){
        let User = await UserInstance.create({
          id: uuidv4(),
          email, 
          password: hashedPassword,
          firstName:'', 
          lastName:'', 
          salt, 
          address:'', 
          phone, 
          otp, 
          otpExpiry:expiry, 
          longitude:0, 
          latitude:0, 
          verified:false
        }) as unknown as UserAttributes

        const isSent = await sendOTP(otp, phone)
        const html = emailHtml(otp)
        mailSender(email, otp, html)

        const signature = await generateToken({
          id: User.id,
          verified:User.verified,
          email
        })

        return res.status(201).json({
          message: "user created successfully, check you email or phone for otp",
          signature,
          verified:User.verified
        })
      }

    res.status(400).json({
      Error: "user already exists"
    })

  } catch (err) {
    res.status(500).json({
      Error:"Internal server error",
      route:"/users/register"
    })
  }
};

export const verifyUser = async(req:Request, res:Response) => {
  try {
    const { signature } = req.params;
    const { email } = await verifyToken(signature) as JwtPayload;

    const User = await UserInstance.findOne({
      where: { email: email }
    }) as unknown as UserAttributes

    if(User){
      const { otp } = req.body
      if(Number(otp) === User.otp && User.otpExpiry >= (new Date())){
        User.verified = true;
        const updateUSer = await UserInstance.update(
          { verified: true },
          { where: { email: email } }
        )

        //Generate new signature
        const signature = await generateToken({
          id: User.id,
          verified: User.verified,
          email
        })

        return res.status(200).json({
          message: "user verified",
          signature,
          verified:User.verified
        })

      }
      // else{
        // const {otp, expiry} = generateOtp();
        // const isSent = await sendOTP(otp, User.phone)
        // const html = emailHtml(otp)
        // mailSender(User.email, otp, html)
        res.status(400).json({
          Error: "Otp expired."
        })
      // }
    }
    // else{
    res.status(401).json({
      Error: "User does not exist or otp expired."
    })
    // }

  } catch (error) {
    res.status(500).json({
      Error:"Internal server error",
      route:"/users/verify"
    })
  }
}