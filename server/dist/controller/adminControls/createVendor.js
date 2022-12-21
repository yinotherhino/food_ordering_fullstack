"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = void 0;
const uuid_1 = require("uuid");
const userModel_1 = require("../../model/userModel");
const vendorModel_1 = require("../../model/vendorModel");
const utility_1 = require("../../utils/utility");
const createVendor = async (req, res) => {
    try {
        const id = req.user.id;
        const admin = await userModel_1.UserInstance.findOne({ where: { id: id } });
        if (admin.role === "admin" || admin.role === "superadmin") {
            const { name, email, phone, password, ownerName, address, pincode } = req.body;
            const validateResult = utility_1.vendorRegisterSchema.validate(req.body, utility_1.option);
            if (validateResult.error) {
                return res.status(400).json({
                    Error: validateResult.error.details[0].message
                });
            }
            const salt = await (0, utility_1.generateSalt)();
            const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
            const vendor = await vendorModel_1.VendorInstance.findOne({
                where: { email: email }
            });
            if (!vendor) {
                const createNewVendor = await vendorModel_1.VendorInstance.create({
                    id: (0, uuid_1.v4)(),
                    email,
                    password: hashedPassword,
                    name,
                    ownerName,
                    salt,
                    address,
                    phone,
                    pincode,
                    role: "vendor",
                    serviceAvailable: false,
                    rating: 0
                });
                return res.status(201).json({
                    message: "user created successfully, check you email or phone for otp",
                    createNewVendor,
                    role: createNewVendor.role
                });
            }
            res.status(400).json({
                Error: "vendor already exists"
            });
        }
        else {
            res.status(400).json({
                Error: "Unauthorized"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            Error: "Server error."
        });
    }
};
exports.createVendor = createVendor;
