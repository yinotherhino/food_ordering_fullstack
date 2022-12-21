"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
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
        type: sequelize_1.DataTypes.STRING,
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
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Phone number is required"
            },
            notEmpty: {
                msg: "provide a phone number"
            }
        }
    },
    otp: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp is required"
            },
            notEmpty: {
                msg: "provide an otp"
            }
        }
    },
    otpExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Otp is expired"
            }
        }
    },
    longitude: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    latitude: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: {
                msg: "User must be verified"
            }
        }
    }
}, {
    sequelize: config_1.db,
    tableName: "user"
});
