import { UserAttributes, UserInstance } from "../model/userModel";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { adminRegisterSchema, generatePassword, generateSalt, generateToken, option, registerSchema } from "../utils/utility";
import { generateOtp } from "../utils/otp";

export * from "./adminControls/createVendor"
export * from "./adminControls/createSuperAdmin"

export const adminRegister = async (req: JwtPayload, res: Response) => {
    try {
        const id= req.user.id
        const admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes
        if(admin.role === "superadmin"){ 
      const { email, phone, password, firstName, lastName, address } = req.body;
      const validateResult = adminRegisterSchema.validate( req.body, option )
  
      if(validateResult.error){
        return res.status(400).json({
          Error: validateResult.error.details[0].message
        })
      }
        const {otp, expiry} = generateOtp();
        const salt = await generateSalt();
        const hashedPassword = await generatePassword(password, salt);
  
        const newAdmin = await UserInstance.findOne({
          where: {email: email}
        })
        
        if(!newAdmin){
          let Admin = await UserInstance.create({
            id: uuidv4(),
            email, 
            password: hashedPassword,
            firstName, 
            lastName, 
            salt, 
            address, 
            phone, 
            otp, 
            otpExpiry:expiry, 
            longitude:0, 
            latitude:0, 
            verified:true,
            role:"admin"
          }) as unknown as UserAttributes
  
          const signature = await generateToken({
            id: Admin.id,
            verified:Admin.verified,
            email
          })
  
          return res.status(201).json({
            message: "user created successfully, check you email or phone for otp",
            signature,
            verified:Admin.verified,
            role: Admin.role
          })
        }
  
      res.status(400).json({
        Error: "user already exists"
      })
    }
    else{
        res.status(400).json({
            Error: "You are not a superadmin and you cannot add a new admin"
        })
    }
  
    } catch (err) {
      res.status(500).json({
        Error:"Internal server error",
        route:"/admin/register"
      })
    }
  };
  

  