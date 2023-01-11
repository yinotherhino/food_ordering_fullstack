import express from "express";
import {auth} from '../middleware/authorization'
import {
  getAllUsers,
  getSingleUser,
  Login,
  Register,
  resendOTP,
  updateUserProfile,
  verifyUser,
} from "../controller/userController";

const router = express.Router();

router.post("/signup", Register);
router.post("/verify/:signature", verifyUser);
router.post("/login", Login);
router.get("/resend-otp/:signature", resendOTP);
router.get("/get-all-users", getAllUsers);
router.get("/get-user", auth, getSingleUser);
router.patch("/update-profile", auth, updateUserProfile);

export default router;
