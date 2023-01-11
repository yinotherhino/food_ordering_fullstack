import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  adminSchema,
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  Generatesignature,
  option,
  vendorSchema,
} from "../utils";

import { UserAttributes, UserInstance } from "../model/userModel";

import { v4 as uuidv4 } from "uuid";
import { VendorAttributes, VendorInstance } from "../model/vendorModel";

/** ================= Register Admin ===================== **/
export const AdminRegister = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { email, phone, password, firstName, lastName, address } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = GenerateOTP();

    // check if the admin exist
    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    if (Admin.email === email) {
      return res.status(400).json({
        message: "Email Already exist",
      });
    }

    if (Admin.phone === phone) {
      return res.status(400).json({
        message: "Phone number  already exist",
      });
    }

    //Create Admin
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
        role: "admin",
      });

      // check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;

      //Generate signature for user
      let signature = await Generatesignature({
        id: Admin.id,
        email: Admin.email,
        verified: Admin.verified,
      });

      return res.status(201).json({
        message: "Admin created successfully",
        signature,
        verified: Admin.verified,
      });
    }
    return res.status(400).json({
      message: "Admin already exist",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
    });
  }
};

/** ================= Super Admin ===================== **/
export const SuperAdmin = async (req: JwtPayload, res: Response) => {
  try {
    const { email, phone, password, firstName, lastName, address } = req.body;
    const uuiduser = uuidv4();

    const validateResult = adminSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const adminPassword = await GeneratePassword(password, salt);

    // Generate OTP
    const { otp, expiry } = GenerateOTP();

    // check if the admin exist
    const Admin = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;

    //Create Admin
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
        role: "superadmin",
      });

      // check if the admin exist
      const Admin = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;

      //Generate signature for user
      let signature = await Generatesignature({
        id: Admin.id,
        email: Admin.email,
        verified: Admin.verified,
      });

      return res.status(201).json({
        message: "Admin created successfully",
        signature,
        verified: Admin.verified,
      });
    }
    return res.status(400).json({
      message: "Admin already exist",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-admin",
    });
  }
};

/** ================= Create Vendor ===================== **/
export const createVendor = async (req: JwtPayload, res: Response) => {
  try {
    const id = req.user.id;
    const { name, restaurantName, pincode, phone, address, email, password } =
      req.body;
    const uuidvendor = uuidv4();
    const validateResult = vendorSchema.validate(req.body, option);
    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const vendorPassword = await GeneratePassword(password, salt);

    // check if the vendor exist
    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttributes;

    const Admin = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    if (Admin.role === "admin" || Admin.role === "superadmin") {
      if (!Vendor) {
        const createVendor = await VendorInstance.create({
          id: uuidvendor,
          name,
          restaurantName,
          pincode,
          phone,
          address,
          email,
          password: vendorPassword,
          salt,
          role: "vendor",
          serviceAvailable: false,
          rating: 0,
          coverImage:''
        });

        return res.status(201).json({
          message: "Vendor created successfully",
          createVendor,
        });
      }
      return res.status(400).json({
        message: "Vendor already exist",
      });
    }

    return res.status(400).json({
      message: "unathorised",
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/admins/create-vendors",
    });
  }
};
