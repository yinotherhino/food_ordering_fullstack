import express from "express";
import { getAllUsers, getSingleUser } from "../controller/getUsers";
import { updateUSerProfile } from "../controller/updateProfile";
import {  Register, verifyUser } from "../controller/userController";
import { auth } from "../middleware/auth";

const router = express.Router();
router.post("/register", Register);

router.post("/verify/:signature", verifyUser);

router.get('/', auth,getAllUsers)

router.get('/singleuser', auth, getSingleUser)

router.patch('/update', auth, updateUSerProfile)

export default router;