import { Request, Response } from "express";
import { generateOtp } from "../utils/otp";
import {UserInstance} from "../model/userModel"
import { generatePassword, generateSalt, option, registerSchema } from "../utils/utility";
import { v4 as uuidv4 } from "uuid";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirmPassword } = req.body
    const validateResult = registerSchema.validate(req.body, option)

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
        })

        return res.status(201).json({
          message: "user created successfully"
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
