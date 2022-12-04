"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authorization_1 = require("../middleware/authorization");
const router = express_1.default.Router();
router.post("/signup", userController_1.Register);
router.post("/verify/:signature", userController_1.verifyUser);
router.post("/login", userController_1.Login);
router.get("/resend-otp/:signature", userController_1.resendOTP);
router.get("/get-all-users", userController_1.getAllUsers);
router.get("/get-user", authorization_1.auth, userController_1.getSingleUser);
router.patch("/update-profile", authorization_1.auth, userController_1.updateUserProfile);
exports.default = router;
