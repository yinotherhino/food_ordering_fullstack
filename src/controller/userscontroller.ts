import { Request, Response } from "express";
import { option, registerSchema } from "../utils/utility";

export const Register = (req: Request, res: Response) => {
  try {
    const { email, phone, password, confirmPassword } = req.body
    const validateResult = registerSchema.validate(req.body, option)

    if(validateResult.error){
      res.status(400).json({
        Error: validateResult.error.details[0].message
      })
    }
    else{

    }
  } catch (err) {
    console.log(err);
  }
};
