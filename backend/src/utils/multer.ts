import multer from "multer"
const cloudinary = require("cloudinary").v2

import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
    cloud_name:process.env.cloudName,
    api_key:process.env.cloudKey,
    api_secret:process.env.cloudSecret,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req,file)=>{
        return{
            folder:"SHOPRITE"
        }
    }
})

export const upload = multer({storage:storage})