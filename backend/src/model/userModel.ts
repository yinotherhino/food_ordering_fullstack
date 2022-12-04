import {DataTypes,Model} from "sequelize"
import { db } from "../config";

export interface UserAttribute{
    id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
    salt:string;
    address:string;
    phone:string;
    otp:number;
    otp_expiry:Date;
    lng:number;
    lat:number;
    verified:boolean,
    role:string,
}


export class UserInstance extends Model<UserAttribute>{}

UserInstance.init({
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
    firstName:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    lastName:{
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
    otp:{
        type:DataTypes.NUMBER,
        allowNull:false,
        validate:{
            notNull:{
                msg:"otp is required"
            },
            notEmpty:{
                msg:"provide an otp"
            }
        }
    },
    otp_expiry:{
        type:DataTypes.DATE,
        allowNull:false,
        validate:{
            notNull:{
                msg:"otp expired"
            }
        }
    },
    lng:{
        type:DataTypes.NUMBER,
        allowNull:false,
    },
    lat:{
        type:DataTypes.NUMBER,
        allowNull:false,
    },
    verified:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        validate:{
            notNull:{
                msg:"not yet verified"
            },
            notEmpty:{
                msg:"user is not yet verified"
            }
        }
    },
    role:{
        type:DataTypes.STRING,
        allowNull:false,
    },
   
},
{
    sequelize:db,
    tableName:"user"
}
)
