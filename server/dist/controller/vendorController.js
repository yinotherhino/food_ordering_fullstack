"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorLogin = void 0;
const vendorModel_1 = require("../model/vendorModel");
const utility_1 = require("../utils/utility");
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.LoginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const vendor = await vendorModel_1.VendorInstance.findOne({ where: { email: email } });
        if (vendor) {
            const validation = await (0, utility_1.comparePassword)(password, vendor.password, vendor.salt);
            if (validation) {
                //generate signature
                let signature = await (0, utility_1.generateToken)({
                    id: vendor.id,
                    email: vendor.email,
                    serviceAvailable: vendor.serviceAvailable
                });
                return res.status(200).json({
                    message: 'Vendor logged in successfully',
                    signature,
                    email: vendor.email,
                    serviceAvailable: vendor.serviceAvailable
                });
            }
        }
        return res.status(400).json({
            Error: 'Invalid credentials',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/vendors"
        });
    }
};
exports.vendorLogin = vendorLogin;
