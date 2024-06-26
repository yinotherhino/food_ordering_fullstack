"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodInstance = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("../config");
class FoodInstance extends sequelize_1.Model {
}
exports.FoodInstance = FoodInstance;
FoodInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    foodType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    vendorId: {
        type: sequelize_1.DataTypes.UUIDV4,
        allowNull: true,
    },
    readyTime: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: config_1.db,
    tableName: "food"
});
