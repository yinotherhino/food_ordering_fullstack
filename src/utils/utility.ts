import Joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export const generateSalt = async()=>{
    return await bcrypt.genSalt();
}

export const generatePassword = async( password: string, salt:string )=>{
    return await bcrypt.hash(password, salt)
}