import { DataTypes, Model } from "sequelize";

export interface UserAttributes{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    salt:string;
    address:string;
    phone:string;
    otp:number;
    otpExpiry:Date;
    longitude: number;
    latitude: number;
    verified: boolean;

}

class UserInstance extends 
    Model<UserAttributes>{}
    UserInstance.init({
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
                    message: "Email address is required"
                },
                isEmail: {
                    message: "Please provide a valid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: "password is required"
                },
                notEmpty: {
                    message: "provide a password"
                }
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    message: "Salt is required"
                },
            }
        },
        address:string;
        phone:string;
        otp:number;
        otpExpiry:Date;
        longitude: number;
        latitude: number;
        verified: boolean;


    })