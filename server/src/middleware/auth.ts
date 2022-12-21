import { Response, NextFunction } from "express"
import { appSecret } from "../config"
import jwt, { JwtPayload } from "jsonwebtoken"
import { UserAttributes, UserInstance } from "../model/userModel"
import { RequestCustom } from "../interface/customRequest"
import { Authpayload } from "../interface"

export const auth = async (req: JwtPayload, res:Response, next:NextFunction) => {
    try {
    const authorisation = req.headers.authorization
    if(!authorisation){
        return res.status(401).json({
            Error: "Please log in",
        })
    }
    const token = authorisation.slice(7)
    const verified = jwt.verify(token, appSecret) as Authpayload;
    const {id} = verified;
    const user = await UserInstance.findOne({
        where: {id: id}
    }) as unknown as UserAttributes

    if(!user){
        return res.status(401).json({
            Error: "Please log in",
        })
    }

    req.user = verified
    return next();
    

    } catch (error) {
        res.status(500).json({
            Error: "Server error",
        })
    }
}