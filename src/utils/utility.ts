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
    password: Joi.string().regex(/[a-z0-9]{3,30}/),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label("Confirm password").messages({"any.only":"{{#label}} does not match"}),
    phone: Joi.string().required()
})

