import express from "express";
import { getAllUsers, getSingleUser } from "../controller/userControls/getUsers";
import { updateUSerProfile } from "../controller/userControls/updateProfile";
import {  Login, Register, verifyUser } from "../controller/userController";
import { auth } from "../middleware/auth";

const router = express.Router();
router.post("/signup", Register);

router.post("/verify/:signature", verifyUser);

router.get('/', auth,getAllUsers)

router.post("/login", Login)

router.get('/singleuser', auth, getSingleUser)

router.patch('/update', auth, updateUSerProfile)

export default router;