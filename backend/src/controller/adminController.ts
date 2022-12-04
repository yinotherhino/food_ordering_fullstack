import express, { Request, Response, NextFunction } from "express";
import { adminSchema, emailHtml, GenerateOTP, GeneratePassword, GenerateSalt, GenerateSignature, mailSent, onRequestOTP, option, registerSchema, vendorSchema } from "../utils";
import { UserInstance, UserAttribute } from "../model/userModel";
import { v4 as uuidv4 } from "uuid";
import { fromAdminMail, userSubject } from "../config";
import { JwtPayload } from "jsonwebtoken";
import { VendorAttribute, VendorInstance } from "../model/vendorModel";

//create admin
export const adminRegister = async (req:JwtPayload, res: Response) => {
    try {
        const id = req.user.id
      const { email, phone, password,firstName,lastName,address } = req.body;
  
      const uuiduser = uuidv4();
  
      const validateResult = adminSchema.validate(req.body, option);
  
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      //generate salt
      const salt = await GenerateSalt();
      const adminPassword = await GeneratePassword(password, salt);
  
      // //generate OTP
      const { otp, expiry } = GenerateOTP();
  
      // //check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttribute;

      if(Admin.email===email){
        return res.status(400).json({message:"Email already exists"})
      }
      if(Admin.phone===phone){
        return res.status(400).json({message:"Phone number already exists"})
      }
      // create Admin
      if (Admin.role === "superadmin") {
        await UserInstance.create({
          id: uuiduser,
          email,
          password: adminPassword,
          firstName,
          lastName,
          salt,
          address,
          phone,
          otp,
          otp_expiry: expiry,
          lng: 0,
          lat: 0,
          verified: true,
          role:"admin"
        });
        
       
        //check if the admin exist
        const Admin = (await UserInstance.findOne({
          where: { email: email },
        })) as unknown as UserAttribute;
        //Generate a signature
        let signature = await GenerateSignature({
          id: Admin.id,
          email: Admin.email,
          verified: Admin.verified,
        });
  
        return res.status(201).json({
          message: "admin created successfully",
          signature,
          verified: Admin.verified,
        });
      }
      return res.status(400).json({
        message: "admin already exist",
      });
    } catch (err: any) {
      ///console.log(err.name)
      console.log(err.message);
      // console.log(err.stack)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/create-admin",
      });
    }
  };

  //superAdmin
  export const superAdmin = async (req:JwtPayload, res: Response) => {
    try {
      const { email, phone, password,firstName,lastName,address } = req.body;
  
      const uuiduser = uuidv4();
  
      const validateResult = adminSchema.validate(req.body, option);
  
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
  
      //generate salt
      const salt = await GenerateSalt();
      const adminPassword = await GeneratePassword(password, salt);
  
      // //generate OTP
      const { otp, expiry } = GenerateOTP();
  
      // //check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttribute;

      // create Admin
      if (!Admin) {
        await UserInstance.create({
          id: uuiduser,
          email,
          password: adminPassword,
          firstName,
          lastName,
          salt,
          address,
          phone,
          otp,
          otp_expiry: expiry,
          lng: 0,
          lat: 0,
          verified: true,
          role:"superadmin"
        });
        
       
        //check if the admin exist
        const Admin = (await UserInstance.findOne({
          where: { email: email },
        })) as unknown as UserAttribute;
        //Generate a signature
        let signature = await GenerateSignature({
          id: Admin.id,
          email: Admin.email,
          verified: Admin.verified,
        });
  
        return res.status(201).json({
          message: "admin created successfully",
          signature,
          verified: Admin.verified,
        });
      }
      return res.status(400).json({
        message: "admin already exist",
      });
    } catch (err: any) {
      ///console.log(err.name)
      console.log(err.message);
      // console.log(err.stack)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/create-super-admin",
      });
    }
  };

  //===================Create vendor ====================
  export const createVendor = async(req:JwtPayload, res: Response)=>{
try {
    
  const{
    name,
    resturantName,
    pincode,
    phone,
    address,
    email,
    password,
    
  }=req.body
  const id = req.user.id

  const validateResult = vendorSchema.validate(req.body, option);
  const uuidvendor = uuidv4();
  
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
       //generate salt
       const salt = await GenerateSalt();
       const vendorPassword = await GeneratePassword(password, salt);

        //check if the vendor exist
        const Vendor = (await VendorInstance.findOne({
          where: { email: email },
        })) as unknown as VendorAttribute;

        const Admin = await UserInstance.findOne({
          where: { id: id },
        }) as unknown as UserAttribute;
        if(Admin.role === "admin" || Admin.role === "superadmin"){
          if (!Vendor){
            const createVendor = await VendorInstance.create({
              id:uuidvendor,
              name,
              resturantName,
              pincode,
              phone,
              address,
              email,
              password:vendorPassword,
              salt,
              serviceAvailable:false,
              rating:0,
              role:"vendor",
              coverImage:""
            })
            return res.status(201).json({
              message: "vendor created successfully",
              createVendor
            });
           }
           return res.status(400).json({message:"vendor already exist"})
        }


    
       return res.status(400).json({message:"anothorised"})

} catch (err:any) {
  console.log(err.message);
      // console.log(err.stack)
      res.status(500).json({
        Error: "Internal server Error",
        route: "/admins/create-vendors",
      });
    
}
  }
  

  