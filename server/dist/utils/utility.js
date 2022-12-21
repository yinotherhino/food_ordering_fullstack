"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRegisterSchema = exports.updateSchema = exports.comparePassword = exports.verifyToken = exports.generateToken = exports.generatePassword = exports.generateSalt = exports.LoginSchema = exports.adminRegisterSchema = exports.registerSchema = exports.option = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../config");
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
};
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    confirmPassword: joi_1.default.any().equal(joi_1.default.ref('password')).required().label("Confirm password").messages({ "any.only": "{{#label}} does not match" }),
    phone: joi_1.default.string().required()
});
exports.adminRegisterSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    phone: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.LoginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
});
const generateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.generateSalt = generateSalt;
const generatePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.generatePassword = generatePassword;
const generateToken = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.appSecret, { expiresIn: "10d" });
};
exports.generateToken = generateToken;
const verifyToken = async (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.appSecret);
};
exports.verifyToken = verifyToken;
const comparePassword = async (inputPassword, dbPassword, salt) => {
    return await bcrypt_1.default.compare(inputPassword, dbPassword);
};
exports.comparePassword = comparePassword;
exports.updateSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required()
});
exports.vendorRegisterSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    phone: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    ownerName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    pincode: joi_1.default.string().required(),
});
