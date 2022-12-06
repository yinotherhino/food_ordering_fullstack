import express, { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  option,
  GeneratePassword,
  GenerateSalt,
  GenerateOTP,
  onRequestOTP,
  emailHtml,
  mailSent,
  GenerateSignature,
  verifySignature,
  loginSchema,
  validatePassword,
  updateSchema,
} from "../utils";
import { UserInstance, UserAttribute } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { fromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirm_password } = req.body;

    const uuiduser = uuidv4();

    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //generate salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    // //generate OTP
    const { otp, expiry } = GenerateOTP();

    // //check if the user exist
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttribute;

    // create User
    if (!User) {
      let user = await UserInstance.create({
        id: uuiduser,
        email,
        password: userPassword,
        firstName: "",
        lastName: "",
        salt,
        address: "",
        phone,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role:"user"
      });
      //send otp to user
      // await onRequestOTP(otp, phone);

      //send email
      const html = emailHtml(otp);
      await mailSent(fromAdminMail, email, userSubject, html);

      const User = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;
      //Generate a signature
      let signature = await GenerateSignature({
        id: User.id,
        email: User.email,
        verified: User.verified,
      });

      return res.status(201).json({
        message: "user created successfully check your email or phone number for verification",
        signature,
        verified: User.verified,
      });
    }
    return res.status(400).json({
      message: "user already exist",
    });
  } catch (err: any) {
    ///console.log(err.name)
    console.log(err.message);
    // console.log(err.stack)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/signup",
    });
  }
};

//===================== Verify User=============================
export const verifyUser = async(req:Request,res:Response)=>{
  try {
    //users/verify/id
    //users/
    const token = req.params.signature
    const decode = await verifySignature(token)  
    //check if the user is a registered user
    const User = await UserInstance.findOne({
      where: { email: decode.email },
    }) as unknown as UserAttribute;

    if(User){
      const {otp} = req.body;
      if(User.otp === parseInt(otp) && User.otp_expiry >= new Date()){
        const updatedUser = await UserInstance.update({
          verified:true,
        },{where:{email:decode.email}}) as unknown as UserAttribute
        //Generate a signature
        let signature = await GenerateSignature({
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
        });
        if(updatedUser){
          const User = await UserInstance.findOne({
            where: {email:decode.email},
          }) as unknown as UserAttribute
        
        return res.status(200).json({
          message:"You have successfully verified your account",
          signature,
          verified:User.verified,
        }) 
      }
      }
    }
    return res.status(400).json({
      Error:"OTP is invalid or expired"
    })

  } catch (error) {
    res.status(500).json({
      Error:"internal server error",
      route: "/users/verify",
    })
  }
}

//==================Login Users ===============================
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

//check if the user exists

const User = await UserInstance.findOne({
  where: { email:email },
}) as unknown as UserAttribute;
if(User.verified === true){
  const validation = await validatePassword(password, User.password, User.salt)
  if(validation){
    let signature = await GenerateSignature({
      id:User.id,
      email:User.email,
      verified:User.verified,
    })
    return res.status(200).json({
      message:"You have successfully logged in",
      signature,
      email:User.email,
      verified:User.verified,
      role:User.role
    })
  }
}
return res.status(400).json({
 Error:"Wrong username and password or not a verified user" 
})
  } catch (err: any) {
    ///console.log(err.name)
    console.log(err.message);
    // console.log(err.stack)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/users/login",
    });
  }
};

// =======================Resend otp ====================================
export const resendOTP= async(req:Request,res:Response)=>{
  try {
    const token = req.params.signature
    const decode = await verifySignature(token)
    //check if user is a registered user  
    const User = await UserInstance.findOne({
      where: { email: decode.email },
    }) as unknown as UserAttribute;
    if(User){
      //generate OTP
      const {otp, expiry}=GenerateOTP();

      const updatedUser = await UserInstance.update({
        otp,
        otp_expiry:expiry,
      },{where:{email:decode.email}}) as unknown as UserAttribute

      if(updatedUser){
        const User = await UserInstance.findOne({
          where: { email: decode.email },
        }) as unknown as UserAttribute;
        //send otp to user
        await onRequestOTP(otp,User.phone)

      //send mail to user
      const html = emailHtml(otp);
      await mailSent(fromAdminMail, User.email, userSubject, html);
      return res.status(200).json({
        message:"OTP resend to registered phone number and email",
      })
    }
    }
      return res.status(400).json({
        Error:"Error sending OTP"
      })

  } catch (err:any) {
    console.log(err.message)
    res.status(500).json({
      Error:"internal server error",
      route: "/users/resend-otp/:signature",
    })
  }
}
//===================================Profile=============================
export const getAllUsers =async (req:Request, res:Response)=>{
  
  try {
    const limit = req.query.limit as number | undefined
    const users = await UserInstance.findAndCountAll({
      limit:limit
    })
  return res.status(200).json({
    message:"You have successfully retrieved all users",
    Count:users.count,
    Users:users.rows
  })
  } catch (err:any) {
    console.log(err.message)
    res.status(500).json({
      Error:"internal server error",
      route: "/users/get-all-users",
    })
  }
} 
//=================== single user =======================
export const getSingleUser = async(req:JwtPayload, res:Response)=>{
  try {
    const id = req.user.id
    //find user by id
    const User = await UserInstance.findOne({
      where: { id:id },
    }) as unknown as UserAttribute;

    if(User){
      return res.status(200).json({
        message:"This is your profile",
        User
      })
    }
    return res.status(400).json({
      message:"User not found",
    })

  } catch (err:any) {
    console.log(err.message)
    res.status(500).json({
      Error:"internal server error",
      route: "/users/get-user",
    })
  }
}

//==========================update profile==========================

export  const updateUserProfile = async (req:JwtPayload,res:Response)=>{
  try {

    const id = req.user.id
    const {firstName,lastName,address,phone}=req.body
    //joi validation

    const validateResult = updateSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
//check if it is a registered user
const User = await UserInstance.findOne({
  where: { id: id },
}) as unknown as UserAttribute;
if(!User){
  return res.status(400).json({
    Error:"you are not authorised to update your profile",
  })
}
const updatedUser = await UserInstance.update({
  firstName,
  lastName,
  phone,
  address,
},{where:{id:id}}) as unknown as UserAttribute

if(updatedUser){
 return res.status(200).json({
  message: "User updated",
  updatedUser:User,
 })
}
return res.status(400).json({
  Error:"Error updating your profile",
})

  } catch (err:any) {
    console.log(err.message)
    res.status(500).json({
      Error:"internal server error",
      route: "/users/update-profile",
    })
  }
}