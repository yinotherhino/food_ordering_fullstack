"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorProfile = exports.deleteFood = exports.vendorProfile = exports.createFood = exports.vendorLogin = void 0;
const vendorModel_1 = require("../model/vendorModel");
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const foodModel_1 = require("../model/foodModel");
const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exists
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { email: email },
        }));
        console.log(Vendor);
        if (Vendor) {
            const validation = await (0, utils_1.validatePassword)(password, Vendor.password, Vendor.salt);
            if (validation) {
                let signature = await (0, utils_1.GenerateSignature)({
                    id: Vendor.id,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: Vendor.email,
                    serviceAvailable: Vendor.serviceAvailable,
                    role: Vendor.role,
                });
            }
        }
        return res.status(400).json({
            Error: "you are not a verified vendor",
        });
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/login",
        });
    }
};
exports.vendorLogin = vendorLogin;
//================ Vendor Add Food ===============
const createFood = async (req, res) => {
    try {
        const { name, description, category, foodType, readyTime, price, image } = req.body;
        const id = req.vendor.id;
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        const foodid = (0, uuid_1.v4)();
        if (Vendor) {
            const createFood = await foodModel_1.FoodInstance.create({
                id: foodid,
                name,
                description,
                category,
                foodType,
                readyTime,
                price,
                vendorId: id,
                rating: 0,
                image: req.file.path
            });
            return res.status(201).json({
                message: "food added successfully",
                createFood,
            });
        }
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-food",
        });
    }
};
exports.createFood = createFood;
//=================== Get vendor profile =============================
const vendorProfile = async (req, res) => {
    try {
        const id = req.vendor.id;
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
            attributes: ["id", "name", "ownerName", "pincode", "phone", "address", "email", "salt", "serviceAvailable", "rating", "role"],
            include: [
                {
                    model: foodModel_1.FoodInstance,
                    as: "food",
                    attributes: ["id", "name", "description", "category", "foodType", "readyTime", "price", "rating", "vendorId"]
                }
            ]
        }));
        return res.status(200).json({ Vendor });
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/get-profile",
        });
    }
};
exports.vendorProfile = vendorProfile;
//=================== Vendor delete food =============================
const deleteFood = async (req, res) => {
    try {
        const id = req.vendor.id;
        const foodid = req.params.foodid;
        const Vendor = (await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        }));
        if (Vendor) {
            // const Food = (await FoodInstance.findOne({
            //   where: { id: foodid },
            // })) as unknown as FoodAttribute;
            const deletedFood = await foodModel_1.FoodInstance.destroy({ where: { id: foodid } });
            return res.status(200).json({
                message: "You have successfully deleted food",
                deletedFood,
            });
        }
    }
    catch (err) {
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/delete-food",
        });
    }
};
exports.deleteFood = deleteFood;
//==========================update vendor profile==========================
const updateVendorProfile = async (req, res) => {
    try {
        const id = req.vendor.id;
        const { name, phone, address, coverImage } = req.body;
        //joi validation
        const validateResult = utils_1.updateVendorSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        // console.log("hello")
        //check if it is a registered user
        const User = await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        });
        if (!User) {
            return res.status(400).json({
                Error: "you are not authorised to update your profile",
            });
        }
        const updatedUser = await vendorModel_1.VendorInstance.update({
            name,
            phone,
            address,
            coverImage
        }, { where: { id: id } });
        if (updatedUser) {
            return res.status(200).json({
                message: "Vendor updated",
                updatedUser: User,
            });
        }
        return res.status(400).json({
            Error: "Error updating your profile",
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "internal server error",
            route: "/vendors/update-profile",
        });
    }
};
exports.updateVendorProfile = updateVendorProfile;
