"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.verifyUser = exports.Register = void 0;
const otp_1 = require("../utils/otp");
const userModel_1 = require("../model/userModel");
const utility_1 = require("../utils/utility");
const uuid_1 = require("uuid");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const Register = async (req, res) => {
    try {
        const { email, phone, password, confirmPassword } = req.body;
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const { otp, expiry } = (0, otp_1.generateOtp)();
        const salt = await (0, utility_1.generateSalt)();
        const hashedPassword = await (0, utility_1.generatePassword)(password, salt);
        const user = await userModel_1.UserInstance.findOne({
            where: { email: email }
        });
        if (!user) {
            let User = await userModel_1.UserInstance.create({
                id: (0, uuid_1.v4)(),
                email,
                password: hashedPassword,
                firstName: '',
                lastName: '',
                salt,
                address: '',
                phone,
                otp,
                otpExpiry: expiry,
                longitude: 0,
                latitude: 0,
                verified: false,
                role: "user"
            });
            // const isSent = await sendOTP(otp, phone)
            const html = (0, otp_1.emailHtml)(otp);
            (0, otp_1.mailSender)(email, otp, html);
            const signature = await (0, utility_1.generateToken)({
                id: User.id,
                verified: User.verified,
                email
            });
            return res.status(201).json({
                message: "user created successfully, check you email or phone for otp",
                signature,
                verified: User.verified
            });
        }
        res.status(400).json({
            Error: "user already exists"
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/register"
        });
    }
};
exports.Register = Register;
const verifyUser = async (req, res) => {
    try {
        const { signature } = req.params;
        const { email } = await (0, utility_1.verifyToken)(signature);
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email }
        });
        if (User) {
            const { otp } = req.body;
            if (Number(otp) === User.otp && User.otpExpiry >= (new Date())) {
                User.verified = true;
                const updateUSer = await userModel_1.UserInstance.update({ verified: true }, { where: { email: email } });
                //Generate new signature
                const signature = await (0, utility_1.generateToken)({
                    id: User.id,
                    verified: User.verified,
                    email
                });
                return res.status(200).json({
                    message: "user verified",
                    signature,
                    verified: User.verified
                });
            }
            // else{
            // const {otp, expiry} = generateOtp();
            // const isSent = await sendOTP(otp, User.phone)
            // const html = emailHtml(otp)
            // mailSender(User.email, otp, html)
            // return res.status(400).json({
            //   Error: "Otp expired."
            // })
            // }
        }
        // else{
        res.status(401).json({
            Error: "User does not exist or otp expired."
        });
        // }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/users/verify"
        });
    }
};
exports.verifyUser = verifyUser;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.LoginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (User && User.verified === true) {
            const validation = await (0, utility_1.comparePassword)(password, User.password, User.salt);
            if (validation) {
                //generate signature
                let signature = await (0, utility_1.generateToken)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified
                });
                return res.status(200).json({
                    message: 'User logged in successfully',
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
        }
        return res.status(400).json({
            Error: 'Invalid credentials or unverified account',
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/login"
        });
    }
};
exports.Login = Login;
// export const resendOTP = async (req: Request, res: Response) => {
//   try {
//     const token = req.params.signature;
//     const decode = await verifyToken(token);
//     const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttributes;
//     if (User) {
//       const { otp, expiry } = generateOtp();
//       const updateUser = await UserInstance.update({ otp, otpExpiry: expiry }, { where: { email: decode.email } }) as unknown as UserAttributes;
//       if (updateUser) {
//         const User = await UserInstance.findOne({ where: { email: decode.email } }) as unknown as UserAttributes;
//         await onRequestOTP(otp, User.phone);
//         const html = emailHtml(otp);
//         await mailSender(User.email, userSubject, html);
//         return res.status(200).json({
//           message: 'OTP resent successfully',
//         })
//       }
//     }
//     return res.status(400).json({
//       Error: "Error resending OTP",
//     })
//   } catch (err) {
//     res.status(500).json({
//       Error: "Internal Server Error",
//       route: "/users/resend-otp/:signature"
//     })
//   }
// }
