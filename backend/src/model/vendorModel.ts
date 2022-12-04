import {DataTypes,Model} from "sequelize"
import { db } from "../config";
import { FoodInstance } from "./foodModel";

export interface VendorAttribute{
    id:string;
    name:string;
    resturantName:string;
    pincode:string;
    phone:string;
    address:string
    email:string;
    password:string;
    salt:string;
    serviceAvailable:boolean
    rating:number
    role:string
    coverImage:""
    
 }


export class VendorInstance extends Model<VendorAttribute>{}

VendorInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false

    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            notNull:{
                msg:"Email adress is required"
            },
            isEmail:{
                msg:"please provide a valid email"
            }
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"password is required",
            },
            notEmpty:{
                msg:"provide a password"
            }
        }
    },
    resturantName:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    salt:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    address:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            notNull:{
                msg:"provide a phonenumber"
            },
            notEmpty:{
                msg:"provide a phonenumber"
            }
        }
    },
    pincode:{
        type:DataTypes.STRING, 
        allowNull:true,
    },
    
    serviceAvailable:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
    },
    rating:{
        type:DataTypes.NUMBER,
        allowNull:true,
    },
   
    role:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    coverImage:{
        type:DataTypes.STRING,
        allowNull:true,
    },
   
},
{
    sequelize:db,
    tableName:"vendor"
}
)

VendorInstance.hasMany(FoodInstance,{foreignKey:"vendorId",as:"food"});

FoodInstance.belongsTo(VendorInstance,{foreignKey:"vendorId",as:"vendor"})