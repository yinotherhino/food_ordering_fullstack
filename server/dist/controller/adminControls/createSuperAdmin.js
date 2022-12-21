"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../../model/userModel");
const utility_1 = require("../../utils/utility");
const createSuperAdmin = async (req, res) => {
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
            const salt = await (0, utility_1.generateSalt)();
            const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
            const newAdmin = await userModel_1.UserInstance.findOne({
                where: { email: email }
            });
            if (!newAdmin) {
                let superAdmin = await userModel_1.UserInstance.create({
                    id: (0, uuid_1.v4)(),
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    salt,
                    address,
                    phone,
                    otp: 0,
                    otpExpiry: new Date(),
                    longitude: 0,
                    latitude: 0,
                    verified: true,
                    role: "superadmin"
                });
                return res.status(201).json({
                    message: "user created successfully, check you email or phone for otp",
                    verified: superAdmin.verified,
                    role: superAdmin.role
                });
            }
            res.status(400).json({
                Error: "superadmin already exists"
            });
        }
        else {
            res.status(400).json({
                error: "You are not authorised to create an admin"
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
exports.createSuperAdmin = createSuperAdmin;
