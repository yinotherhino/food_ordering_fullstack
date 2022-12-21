import { UserInstance } from "../../model/userModel";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

export const getAllUsers = async(req:Request, res:Response) => {
    try {
      // const users = await UserInstance.findAll({})
      const limit = req.query.limit  as number | undefined;
        const users = await UserInstance.findAndCountAll({
            limit:limit
        })
      return res.status(200).json({
        message: "You have successfully retrieved all users.",
        noOfUsers:users.count,
        Users:users.rows
      })
  
    } catch (error) {
        res.status(500).json({
        Error: "Internal Server Error",
        route: "/users"
      })
    }
  }

  export const getSingleUser = async(req:JwtPayload, res:Response) => {
    try {
      const id = req.user.id  as string | undefined;
        const user = await UserInstance.findOne(
            {
            where:{id:id}}
            )
      return res.status(200).json({
        message: "",
        User:user
      })
  
    } catch (error) {
        res.status(500).json({
        Error: "Internal Server Error",
        route: "/users"
      })
    }
  }