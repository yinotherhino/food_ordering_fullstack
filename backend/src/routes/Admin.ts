import express from "express"
import { adminRegister, createVendor, superAdmin } from "../controller/adminController"
import { getAllUsers, getSingleUser, Login, Register, resendOTP, updateUserProfile, verifyUser } from "../controller/userController"
import {auth} from "../middleware/authorization"

const router = express.Router()

router.post("/create-admin" ,auth,adminRegister)
router.post("/create-super-admin" , superAdmin)
router.post("/create-vendors" ,auth, createVendor)


export default router