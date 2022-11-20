import { DataTypes, Model } from "sequelize";
import { db } from "../config";

export interface FoodAttributes{
    id:string;
    foodType:string;
    description:string;
    name:string;
    category:string;
    readyTime:number;
    price:number;
    rating:number;
    vendorId:string


}

export class FoodInstance extends 
    Model<FoodAttributes>{}

    FoodInstance.init({
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },   
        foodType: {
            type: DataTypes.STRING,
            allowNull: false,
        },    
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        price: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        readyTime:{
            type: DataTypes.NUMBER,
            allowNull: false
        },
        vendorId:{
            type:DataTypes.UUIDV4,
            allowNull:false
        }
    },

    {
        sequelize:db,
        tableName:"food"
    }
    );