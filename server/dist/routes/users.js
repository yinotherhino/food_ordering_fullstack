"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getUsers_1 = require("../controller/userControls/getUsers");
const updateProfile_1 = require("../controller/userControls/updateProfile");
const userController_1 = require("../controller/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/signup", userController_1.Register);
router.post("/verify/:signature", userController_1.verifyUser);
router.get('/', auth_1.auth, getUsers_1.getAllUsers);
router.post("/login", userController_1.Login);
router.get('/singleuser', auth_1.auth, getUsers_1.getSingleUser);
router.patch('/update', auth_1.auth, updateProfile_1.updateUSerProfile);
exports.default = router;
