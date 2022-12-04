import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../middleware/authorization";
import { VendorAttribute, VendorInstance } from "../model/vendorModel";
import {
  GenerateSignature,
  loginSchema,
  option,
  updateVendorSchema,
  validatePassword,
} from "../utils";
import { v4 as uuidv4 } from "uuid";
import { FoodAttribute, FoodInstance } from "../model/foodModel";

export const vendorLogin = async(req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //check if the user exists

    const Vendor = (await VendorInstance.findOne({
      where: { email: email },
    })) as unknown as VendorAttribute;
    console.log(Vendor)

    if (Vendor) {
      const validation = await validatePassword(
        password,
        Vendor.password,
        Vendor.salt
      );
      
      if (validation) {
        let signature = await GenerateSignature({
          id: Vendor.id,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
        });
        return res.status(200).json({
          message: "You have successfully logged in",
          signature,
          email: Vendor.email,
          serviceAvailable: Vendor.serviceAvailable,
          role: Vendor.role,
        });
      }
    }
    return res.status(400).json({
      Error: "you are not a verified vendor",
    });
  } catch (err: any) {
    ///console.log(err.name)
    console.log(err.message);
    // console.log(err.stack)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/login",
    });
  }
};

//================ Vendor Add Food ===============

export const createFood = async (req: JwtPayload, res: Response) => {
  try {
    const { name, description, category, foodType, readyTime, price,image } =
      req.body;

      const id = req.vendor.id;
      
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
    })) as unknown as VendorAttribute;
    const foodid = uuidv4();
    if (Vendor) {
      const createFood = await FoodInstance.create({
        id: foodid,
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        vendorId: id,
        rating: 0,
        image:req.file.path
      });
      return res.status(201).json({
        message: "food added successfully",
        createFood,
      });
    }
  } catch (err: any) {
    ///console.log(err.name)
    console.log(err.message);
    // console.log(err.stack)
    res.status(500).json({
      Error: "Internal server Error",
      route: "/vendors/create-food",
    });
  }
};

//=================== Get vendor profile =============================
export const vendorProfile = async(req: JwtPayload, res: Response)=>{
  try {
    const id = req.vendor.id

    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
      attributes:["id", "name","ownerName","pincode","phone","address","email","salt","serviceAvailable","rating","role"],
      include:[
        {
          model:FoodInstance,
          as:"food",
          attributes:["id","name","description","category","foodType","readyTime","price","rating","vendorId"]
        }
      ]
    })) as unknown as VendorAttribute;
    return res.status(200).json({Vendor})


  } catch (err:any) {
     ///console.log(err.name)
     console.log(err.message);
     // console.log(err.stack)
     res.status(500).json({
       Error: "Internal server Error",
       route: "/vendors/get-profile",
     });
  }
}

//=================== Vendor delete food =============================
export const deleteFood = async (req: JwtPayload, res: Response)=>{
  try {
    const id = req.vendor.id;
    const foodid = req.params.foodid
    const Vendor = (await VendorInstance.findOne({
      where: { id: id },
    })) as unknown as VendorAttribute;

    if(Vendor){
      // const Food = (await FoodInstance.findOne({
      //   where: { id: foodid },
      // })) as unknown as FoodAttribute;
      const deletedFood = await FoodInstance.destroy({where: { id: foodid }})
      return res.status(200).json({
        message:"You have successfully deleted food",
        deletedFood,
      });
    }

  } catch (err:any) {
    console.log(err.message);
     // console.log(err.stack)
     res.status(500).json({
       Error: "Internal server Error",
       route: "/vendors/delete-food",
     });
  }

}

//==========================update vendor profile==========================

export  const updateVendorProfile = async (req:JwtPayload,res:Response)=>{
  try {

    const id = req.vendor.id
    const {name,phone,address,coverImage}=req.body
    //joi validation

    const validateResult = updateVendorSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }
   // console.log("hello")
//check if it is a registered user
const User = await VendorInstance.findOne({
  where: { id: id },
}) as unknown as VendorAttribute;

if(!User){
  return res.status(400).json({
    Error:"you are not authorised to update your profile",
  })
}
const updatedUser = await VendorInstance.update({
  name,
  phone,
  address,
  coverImage
},{where:{id:id}}) as unknown as VendorAttribute

if(updatedUser){
 return res.status(200).json({
  message: "Vendor updated",
  updatedUser:User,
 })
}
return res.status(400).json({
  Error:"Error updating your profile",
})

  } catch (err:any) {
    console.log(err.message)
    res.status(500).json({
      Error:"internal server error",
      route: "/vendors/update-profile",
    })
  }
}