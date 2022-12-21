import { Request, Response } from "express";
import { emailHtml, generateOtp, mailSender, sendOTP } from "../utils/otp";
import { UserAttributes, UserInstance } from "../model/userModel";
import { comparePassword, generatePassword, generateSalt, generateToken, LoginSchema, option, registerSchema, verifyToken } from "../utils/utility";
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
          verified:false,
          role:"user"
          
        }) as unknown as UserAttributes

        // const isSent = await sendOTP(otp, phone)
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
        // return res.status(400).json({
        //   Error: "Otp expired."
        // })
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


export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validateResult = LoginSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message
      })
    }
    const User = await UserInstance.findOne({ where: { email: email } }) as unknown as UserAttributes;
    if (User && User.verified === true) {
      const validation = await comparePassword(password, User.password, User.salt);
      if (validation) {
        //generate signature
        let signature = await generateToken({
          id: User.id,
          email: User.email,
          verified: User.verified
        });
        return res.status(200).json({
          message: 'User logged in successfully',
          signature,
          email: User.email,
          verified: User.verified,
        })
      }
    }
    return res.status(400).json({
      Error: 'Invalid credentials or unverified account',
    })
  } catch (err) {
    res.status(500).json({
      Error: "Internal Server Error",
      route: "/users/login"
    })
  }
}


// export const resendOTP = async (req: Request, res: Response) => {
//   try {
//     const token = req.params.signature;
//     const decode = await verifyToken(token);
//     const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttributes;
//     if (User) {
//       const { otp, expiry } = generateOtp();
//       const updateUser = await UserInstance.update({ otp, otpExpiry: expiry }, { where: { email: decode.email } }) as unknown as UserAttributes;
//       if (updateUser) {
//         const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttributes;
//         await onRequestOTP(otp, User.phone);
//         const html = emailHtml(otp);
//         await mailSender(User.email, userSubject, html);
//         return res.status(200).json({
//           message: 'OTP resent successfully',
//         })
//       }
//     }
//     return res.status(400).json({
//       Error: "Error resending OTP",
//     })
//   } catch (err) {
//     res.status(500).json({
//       Error: "Internal Server Error",
//       route: "/users/resend-otp/:signature"
//     })
//   }
// }

