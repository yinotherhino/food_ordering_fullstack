"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleUser = exports.getAllUsers = void 0;
const userModel_1 = require("../../model/userModel");
const getAllUsers = async (req, res) => {
    try {
        // const users = await UserInstance.findAll({})
        const limit = req.query.limit;
        const users = await userModel_1.UserInstance.findAndCountAll({
            limit: limit
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users.",
            noOfUsers: users.count,
            Users: users.rows
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users"
        });
    }
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await userModel_1.UserInstance.findOne({
            where: { id: id }
        });
        return res.status(200).json({
            message: "",
            User: user
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users"
        });
    }
};
exports.getSingleUser = getSingleUser;
