"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVendor = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userModel_1 = require("../model/userModel");
const vendorModel_1 = require("../model/vendorModel");
const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "unauthorised to perform operation"
            });
        }
        //bearer erryyyy
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "unauthorised"
            });
        }
        const { id } = verified;
        //find user by id
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id },
        });
        if (!user) {
            return res.status(401).json({
                Error: "invalid Credentials"
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "unauthorised"
        });
    }
};
exports.auth = auth;
const authVendor = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).json({
                Error: "kindly login"
            });
        }
        //bearer erryyyy
        const token = authorization.slice(7, authorization.length);
        let verified = jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "unauthorised"
            });
        }
        const { id } = verified;
        //find user by id
        const vendor = await vendorModel_1.VendorInstance.findOne({
            where: { id: id },
        });
        if (!vendor) {
            return res.status(401).json({
                Error: "invalid Credentials"
            });
        }
        req.vendor = verified;
        next();
    }
    catch (error) {
        return res.status(401).json({
            Error: "unauthorised"
        });
    }
};
exports.authVendor = authVendor;
