import {DataTypes,Model} from "sequelize"
import { db } from "../config";

export interface FoodAttribute{
    id:string;
    name:string;
    description:string;
    category:string;
    foodType:string;
    readyTime:number;
    price:number;
    rating:number
    image:string;
    vendorId:string
    
 }


export class FoodInstance extends Model<FoodAttribute>{}

FoodInstance.init({
    id:{
        type:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false

    },
    name:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
        
    },
    category:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    
    foodType:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    
    vendorId:{
        type:DataTypes.UUIDV4,
        allowNull:true,
    },
    readyTime:{
        type:DataTypes.NUMBER,
        allowNull:true,
    },
   
    price:{
        type:DataTypes.NUMBER,
        allowNull:false,
    },
    rating:{
        type:DataTypes.NUMBER,
        allowNull:false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true,
    },
   
},
{
    sequelize:db,
    tableName:"food"
}
)