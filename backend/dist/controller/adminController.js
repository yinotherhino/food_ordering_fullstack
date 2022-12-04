"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = exports.superAdmin = exports.adminRegister = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const vendorModel_1 = require("../model/vendorModel");
//create admin
const adminRegister = async (req, res) => {
    try {
        const id = req.user.id;
        const { email, phone, password, firstName, lastName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // //generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // //check if the admin exist
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (Admin.email === email) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (Admin.phone === phone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }
        // create Admin
        if (Admin.role === "superadmin") {
            await userModel_1.UserInstance.create({
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
                role: "admin"
            });
            //check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature
            let signature = await (0, utils_1.GenerateSignature)({
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
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-admin",
        });
    }
};
exports.adminRegister = adminRegister;
//superAdmin
const superAdmin = async (req, res) => {
    try {
        const { email, phone, password, firstName, lastName, address } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // //generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // //check if the admin exist
        const Admin = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        // create Admin
        if (!Admin) {
            await userModel_1.UserInstance.create({
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
                role: "superadmin"
            });
            //check if the admin exist
            const Admin = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature
            let signature = await (0, utils_1.GenerateSignature)({
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
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-super-admin",
        });
    }
};
exports.superAdmin = superAdmin;
//===================Create vendor ====================
const createVendor = async (req, res) => {
    try {
        const { name, resturantName, pincode, phone, address, email, password, } = req.body;
        const id = req.user.id;
        const validateResult = utils_1.vendorSchema.validate(req.body, utils_1.option);
        const uuidvendor = (0, uuid_1.v4)();
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //check if the vendor exist
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        const Admin = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (Admin.role === "admin" || Admin.role === "superadmin") {
            if (!Vendor) {
                const createVendor = await vendorModel_1.VendorInstance.create({
                    id: uuidvendor,
                    name,
                    resturantName,
                    pincode,
                    phone,
                    address,
                    email,
                    password: vendorPassword,
                    salt,
                    serviceAvailable: false,
                    rating: 0,
                    role: "vendor",
                    coverImage: ""
                });
                return res.status(201).json({
                    message: "vendor created successfully",
                    createVendor
                });
            }
            return res.status(400).json({ message: "vendor already exist" });
        }
        return res.status(400).json({ message: "anothorised" });
    }
    catch (err) {
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/admins/create-vendors",
        });
    }
};
exports.createVendor = createVendor;
