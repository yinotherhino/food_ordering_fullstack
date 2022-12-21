"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRegister = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const otp_1 = require("../utils/otp");
__exportStar(require("./adminControls/createVendor"), exports);
__exportStar(require("./adminControls/createSuperAdmin"), exports);
const adminRegister = async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await userModel_1.UserInstance.findOne({ where: { id: id } });
        if (admin.role === "superadmin") {
            const { email, phone, password, firstName, lastName, address } = req.body;
            const validateResult = utility_1.adminRegisterSchema.validate(req.body, utility_1.option);
            if (validateResult.error) {
                return res.status(400).json({
                    Error: validateResult.error.details[0].message
                });
            }
            const { otp, expiry } = (0, otp_1.generateOtp)();
            const salt = await (0, utility_1.generateSalt)();
            const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
            const newAdmin = await userModel_1.UserInstance.findOne({
                where: { email: email }
            });
            if (!newAdmin) {
                let Admin = await userModel_1.UserInstance.create({
                    id: (0, uuid_1.v4)(),
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    salt,
                    address,
                    phone,
                    otp,
                    otpExpiry: expiry,
                    longitude: 0,
                    latitude: 0,
                    verified: true,
                    role: "admin"
                });
                const signature = await (0, utility_1.generateToken)({
                    id: Admin.id,
                    verified: Admin.verified,
                    email
                });
                return res.status(201).json({
                    message: "user created successfully, check you email or phone for otp",
                    signature,
                    verified: Admin.verified,
                    role: Admin.role
                });
            }
            res.status(400).json({
                Error: "user already exists"
            });
        }
        else {
            res.status(400).json({
                Error: "You are not a superadmin and you cannot add a new admin"
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/admin/register"
        });
    }
};
exports.adminRegister = adminRegister;
