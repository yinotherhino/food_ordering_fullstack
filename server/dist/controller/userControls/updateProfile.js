"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUSerProfile = void 0;
const userModel_1 = require("../../model/userModel");
const utility_1 = require("../../utils/utility");
const updateUSerProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, phone } = req.body;
        const validateResult = utility_1.updateSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message
            });
        }
        const User = (await userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (!User) {
            return res.status(404).json({
                Error: "You are not allowed to perform that action."
            });
        }
        const updatedUSer = await userModel_1.UserInstance.update({
            firstName,
            lastName,
            phone,
            address
        }, { where: { id: id } });
        if (updatedUSer) {
            const User = (await userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                ...User,
                message: "You have successfully updated your profile"
            });
        }
        else {
            res.status(401).json({
                Error: "Error finding user",
                route: "/users/update"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal Server Error",
            route: "/users/update"
        });
    }
};
exports.updateUSerProfile = updateUSerProfile;
