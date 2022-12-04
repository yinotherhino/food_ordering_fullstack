import { Request,Response,NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { APP_SECRET } from "../config"
import { UserAttribute, UserInstance } from "../model/userModel"
import { VendorAttribute, VendorInstance } from "../model/vendorModel"

export const auth = async(req:JwtPayload,res:Response,next:NextFunction)=>{
   try {
    const authorization = req.headers.authorization

    if(!authorization){
        return res.status(401).json({
            Error:"unauthorised to perform operation"
        })
    }
    //bearer erryyyy
    const token = authorization.slice(7, authorization.length)
    let verified = jwt.verify(token, APP_SECRET)

    if(!verified){
        return res.status(401).json({
            Error:"unauthorised"
        })
    }
    const {id} = verified as {[key:string]:string}
    //find user by id
    const user = await UserInstance.findOne({
        where: { id:id },
      }) as unknown as UserAttribute;
      if(!user){
        return res.status(401).json({
            Error:"invalid Credentials"
        })
      }
      req.user = verified
      next()
  
  

   } catch (error) {
    return res.status(401).json({
        Error: "unauthorised"
    })
   }
}

export const authVendor = async(req:JwtPayload,res:Response,next:NextFunction)=>{
    try {
     const authorization = req.headers.authorization
 
     if(!authorization){
         return res.status(401).json({
             Error:"kindly login"
         })
     }
     //bearer erryyyy
     const token = authorization.slice(7, authorization.length)
     let verified = jwt.verify(token, APP_SECRET)
 
     if(!verified){
         return res.status(401).json({
             Error:"unauthorised"
         })
     }
     const {id} = verified as {[key:string]:string}
     //find user by id
     const vendor= await VendorInstance.findOne({
         where: { id:id },
       }) as unknown as VendorAttribute;
       if(!vendor){
         return res.status(401).json({
             Error:"invalid Credentials"
         })
       }
       req.vendor= verified
       next()
   
   
 
    } catch (error) {
     return res.status(401).json({
         Error: "unauthorised"
     })
    }
 }