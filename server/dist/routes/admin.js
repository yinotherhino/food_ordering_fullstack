"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/create-admin", auth_1.auth, adminController_1.adminRegister);
router.post("/create-vendors", auth_1.auth, adminController_1.createVendor);
router.post('/create-superadmin', auth_1.auth, (req, res) => {
    res.status(400).json({
        Error: "Route locked."
    });
});
// router.get('/singleuser', auth, getSingleUser)
// router.patch('/update', auth, updateUSerProfile)
exports.default = router;
