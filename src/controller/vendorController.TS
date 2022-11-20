import { Response } from "express";
import {JwtPayload} from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from "../model/vendorModel";
import { comparePassword, generateToken, vendorRegisterSchema, option, LoginSchema } from "../utils/utility";


export const vendorLogin = async (req:JwtPayload, res:Response) => {
    try {
        const { email, password } = req.body;
        const validateResult = LoginSchema.validate(req.body, option);
        if (validateResult.error) {
          res.status(400).json({
            Error: validateResult.error.details[0].message
          })
        }

        const vendor = await VendorInstance.findOne({ where: { email: email } }) as unknown as VendorAttributes;
        if (vendor) {
          const validation = await comparePassword(password, vendor.password, vendor.salt);
          if (validation) {
            //generate signature
            let signature = await generateToken({
              id: vendor.id,
              email: vendor.email,
              serviceAvailable: vendor.serviceAvailable
            });
            return res.status(200).json({
              message: 'Vendor logged in successfully',
              signature,
              email: vendor.email,
              serviceAvailable:vendor.serviceAvailable
            })
          }
        }
        return res.status(400).json({
          Error: 'Invalid credentials',
        })
      } catch (err) {
        res.status(500).json({
          Error: "Internal Server Error",
          route: "/vendors"
        })
      }
}