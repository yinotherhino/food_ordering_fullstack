import { Request, Response, NextFunction } from "express"

export const auth = async (req: Request, res:Response, next:NextFunction) => {
    try {
    const authorisation = req.headers.authorization as string | undefined
    if(!authorisation){
        return res.status(401).json({
            Error: "Please log in",
        })
    }
    const token = authorisation.slice(7)


    next()
    } catch (error) {
        res.status(500).json({
            Error: "Server error",
        })
    }
}