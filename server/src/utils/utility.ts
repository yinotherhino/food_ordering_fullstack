import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { appSecret } from "../config";
import { Authpayload } from "../interface";

export const option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ""
        }
    }
}

export const registerSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label("Confirm password").messages({"any.only":"{{#label}} does not match"}),
    phone: Joi.string().required()
})

export const adminRegisterSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    phone: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
})

export const LoginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
})

export const generateSalt = async()=>{
    return await bcrypt.genSalt();
}

export const generatePassword = async( password: string, salt:string )=>{
    return await bcrypt.hash(password, salt)
}

export const generateToken = async(payload:Authpayload) => {
    return jwt.sign(payload, appSecret as string, {expiresIn: "10d"})
}

export const verifyToken = async(token:string) => {
    return jwt.verify(token, appSecret)
}

export const comparePassword = async (inputPassword:string, dbPassword:string, salt:string) => {
    return await bcrypt.compare(inputPassword, dbPassword)
}

export const updateSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required()
})

export const vendorRegisterSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('[a-z]{3,30}[0-9]{1,30}')),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    ownerName: Joi.string().required(),
    address: Joi.string().required(),
    pincode: Joi.string().required(),
})
