import { UserAttributes, UserInstance } from "../../model/userModel";
import { Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { option, updateSchema } from "../../utils/utility";

export const updateUSerProfile = async(req: JwtPayload, res:Response) => {
    try {
        const id = req.user.id
        const {firstName, lastName, address, phone} = req.body

        const validateResult = updateSchema.validate(req.body, option)
        if(validateResult.error){
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            })
        }

        const User = (await UserInstance.findOne({
            where: {id: id},
        })) as unknown as UserAttributes

        if(!User){
            return res.status(404).json({
                Error: "You are not allowed to perform that action."
            })
        }

        const updatedUSer = await UserInstance.update({
            firstName,
            lastName,
            phone,
            address
        },
        {where: {id:id}}
        )

        if(updatedUSer){
            const User = (await UserInstance.findOne({
                where: {id: id},
            })) as unknown as UserAttributes
            return res.status(200).json({
                ...User,
                message: "You have successfully updated your profile"
            })
        }
        else{
            res.status(401).json({
                Error: "Error finding user",
                route: "/users/update"
            })
        }

    } catch (error) {
        res.status(500).json({
        Error: "Internal Server Error",
        route: "/users/update"
        })
    }
}