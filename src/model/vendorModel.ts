import { DataTypes, Model } from "sequelize";
import { db } from "../config";

export interface VendorAttributes{
    id: string;
    name: string;
    ownerName:string;
    pincode:string;
    email: string;
    password: string;
    salt:string;
    rating:number;
    address:string;
    serviceAvailable:boolean;
    phone:string;
    role: "vendor"
}

export class VendorInstance extends 
    Model<VendorAttributes>{}

    VendorInstance.init({
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: "Email address is required"
                },
                isEmail: {
                    msg: "Please provide a valid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "password is required"
                },
                notEmpty: {
                    msg: "provide a password"
                }
            }
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                notNull: {
                    msg: "Phone number is required"
            },
            notEmpty: {
                msg: "provide a phone number"
            }
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerName:{
            type: DataTypes.STRING,
            allowNull: false
        },
        pincode:{
            type: DataTypes.STRING,
            allowNull: false
        },
        rating:{
            type: DataTypes.NUMBER,
            allowNull: true
        },
        serviceAvailable:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },

    {
        sequelize:db,
        tableName:"vendor"
    }
    );