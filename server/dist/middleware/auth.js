"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const auth = async (req, res, next) => {
    try {
        const authorisation = req.headers.authorization;
        if (!authorisation) {
            return res.status(401).json({
                Error: "Please log in",
            });
        }
        const token = authorisation.slice(7);
        const verified = jsonwebtoken_1.default.verify(token, config_1.appSecret);
        const { id } = verified;
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id }
        });
        if (!user) {
            return res.status(401).json({
                Error: "Please log in",
            });
        }
        req.user = verified;
        return next();
    }
    catch (error) {
        res.status(500).json({
            Error: "Server error",
        });
    }
};
exports.auth = auth;
