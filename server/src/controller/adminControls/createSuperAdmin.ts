import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserAttributes, UserInstance } from "../../model/userModel";
import { VendorAttributes, VendorInstance } from "../../model/vendorModel";
import {  adminRegisterSchema, generatePassword, generateSalt, option, vendorRegisterSchema } from "../../utils/utility";

export const createSuperAdmin = async (req: JwtPayload, res: Response) => {
    try {
        const id = req.user.id
        const admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes
    if(admin.role === "superadmin"){ 
      const { email, phone, password, firstName, lastName, address } = req.body;
      const validateResult = adminRegisterSchema.validate( req.body, option )
  
      if(validateResult.error){
        return res.status(400).json({
          Error: validateResult.error.details[0].message
        })
      }

        const salt = await generateSalt();
        const hashedPassword = await generatePassword(password, salt);
  
        const newAdmin = await UserInstance.findOne({
          where: {email: email}
        })
        
        if(!newAdmin){
          let superAdmin = await UserInstance.create({
            id: uuidv4(),
            email, 
            password: hashedPassword,
            firstName, 
            lastName, 
            salt, 
            address, 
            phone, 
            otp:0, 
            otpExpiry:new Date(), 
            longitude:0, 
            latitude:0, 
            verified:true,
            role:"superadmin"
          }) as unknown as UserAttributes
  
          return res.status(201).json({
            message: "user created successfully, check you email or phone for otp",
            verified:superAdmin.verified,
            role: superAdmin.role
          })
        }
  
      res.status(400).json({
        Error: "superadmin already exists"
      })
    }
    else{
        res.status(400).json({
            error: "You are not authorised to create an admin"
        })
    }
    }
    catch (err) {
      res.status(500).json({
        Error:"Internal server error",
        route:"/admin/register"
      })
    }
  };
  