"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post("/create-admin", authorization_1.auth, adminController_1.adminRegister);
router.post("/create-super-admin", adminController_1.superAdmin);
router.post("/create-vendors", authorization_1.auth, adminController_1.createVendor);
exports.default = router;
