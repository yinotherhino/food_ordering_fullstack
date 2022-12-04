"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getSingleUser = exports.getAllUsers = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const Register = async (req, res) => {
    try {
        const { email, phone, password, confirm_password } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //generate salt
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        // //generate OTP
        const { otp, expiry } = (0, utils_1.GenerateOTP)();
        // //check if the user exist
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        // create User
        if (!User) {
            let user = await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                firstName: "",
                lastName: "",
                salt,
                address: "",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: "user"
            });
            //send otp to user
            await (0, utils_1.onRequestOTP)(otp, phone);
            //send email
            const html = (0, utils_1.emailHtml)(otp);
            await (0, utils_1.mailSent)(config_1.fromAdminMail, email, config_1.userSubject, html);
            //check if the user exist
            const User = (await userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            //Generate a signature
            let signature = await (0, utils_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "user created successfully check your email or phone number for verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            message: "user already exist",
        });
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup",
        });
    }
};
exports.Register = Register;
//===================== Verify User=============================
const verifyUser = async (req, res) => {
    try {
        //users/verify/id
        //users/
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //check if the user is a registered user
        const User = await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        });
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = await userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } });
                //Generate a signature
                let signature = await (0, utils_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                if (updatedUser) {
                    const User = await userModel_1.UserInstance.findOne({
                        where: { email: decode.email },
                    });
                    return res.status(200).json({
                        message: "You have successfully verified your account",
                        signature,
                        verified: User.verified,
                    });
                }
            }
        }
        return res.status(400).json({
            Error: "OTP is invalid or expired"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "internal server error",
            route: "/users/verify",
        });
    }
};
exports.verifyUser = verifyUser;
//==================Login Users ===============================
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exists
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        if (User.verified === true) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                let signature = await (0, utils_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role
                });
            }
        }
        return res.status(400).json({
            Error: "Wrong username and password or not a verified user"
        });
    }
    catch (err) {
        ///console.log(err.name)
        console.log(err.message);
        // console.log(err.stack)
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
        });
    }
};
exports.Login = Login;
// =======================Resend otp ====================================
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const decode = await (0, utils_1.verifySignature)(token);
        //check if user is a registered user  
        const User = await userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        });
        if (User) {
            //generate OTP
            const { otp, expiry } = (0, utils_1.GenerateOTP)();
            const updatedUser = await userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry,
            }, { where: { email: decode.email } });
            if (updatedUser) {
                const User = await userModel_1.UserInstance.findOne({
                    where: { email: decode.email },
                });
                //send otp to user
                await (0, utils_1.onRequestOTP)(otp, User.phone);
                //send mail to user
                const html = (0, utils_1.emailHtml)(otp);
                await (0, utils_1.mailSent)(config_1.fromAdminMail, User.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend to registered phone number and email",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP"
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "internal server error",
            route: "/users/resend-otp/:signature",
        });
    }
};
exports.resendOTP = resendOTP;
//===================================Profile=============================
const getAllUsers = async (req, res) => {
    try {
        const limit = req.query.limit;
        const users = await userModel_1.UserInstance.findAndCountAll({
            limit: limit
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            Count: users.count,
            Users: users.rows
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "internal server error",
            route: "/users/get-all-users",
        });
    }
};
exports.getAllUsers = getAllUsers;
//=================== single user =======================
const getSingleUser = async (req, res) => {
    try {
        const id = req.user.id;
        //find user by id
        const User = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (User) {
            return res.status(200).json({
                message: "This is your profile",
                User
            });
        }
        return res.status(400).json({
            message: "User not found",
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({
            Error: "internal server error",
            route: "/users/get-user",
        });
    }
};
exports.getSingleUser = getSingleUser;
//==========================update profile==========================
const updateUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, phone } = req.body;
        //joi validation
        const validateResult = utils_1.updateSchema.validate(req.body, utils_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if it is a registered user
        const User = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!User) {
            return res.status(400).json({
                Error: "you are not authorised to update your profile",
            });
        }
        const updatedUser = await userModel_1.UserInstance.update({
            firstName,
            lastName,
            phone,
            address,
        }, { where: { id: id } });
        if (updatedUser) {
            return res.status(200).json({
                message: "User updated",
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
            route: "/users/update-profile",
        });
    }
};
exports.updateUserProfile = updateUserProfile;
