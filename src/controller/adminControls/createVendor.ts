import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { UserAttributes, UserInstance } from "../../model/userModel";
import { VendorAttributes, VendorInstance } from "../../model/vendorModel";
import {  generatePassword, generateSalt, option, vendorRegisterSchema } from "../../utils/utility";

export const createVendor = async (req:JwtPayload, res:Response) => {
try {
    const id = req.user.id
    
    const admin = await UserInstance.findOne({where: {id:id}}) as unknown as UserAttributes
    if(admin.role === "admin" || admin.role === "superadmin"){
    const {name, email, phone, password, ownerName, address, pincode} = req.body
    const validateResult = vendorRegisterSchema.validate( req.body, option )

    if(validateResult.error){
        return res.status(400).json({
          Error: validateResult.error.details[0].message
        })
    }

    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    const vendor = await VendorInstance.findOne({
        where: {email: email}
    }) as unknown as VendorAttributes

    if(!vendor){
        const createNewVendor = await VendorInstance.create({
        id: uuidv4(),
        email, 
        password: hashedPassword,
        name, 
        ownerName, 
        salt, 
        address, 
        phone,
        pincode,
        role:"vendor",
        serviceAvailable: false,
        rating: 0
    }) as unknown as VendorAttributes

    return res.status(201).json({
        message: "user created successfully, check you email or phone for otp",
        createNewVendor,
        role: createNewVendor.role
      })
    }

    res.status(400).json({
        Error: "vendor already exists"
      })
    }
    else{
        res.status(400).json({
            Error: "Unauthorized"
        })
    }

} catch (error) {
    console.error(error)
    res.status(500).json({
        Error: "Server error."
    })
}
}