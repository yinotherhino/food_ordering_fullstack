import express from "express";
import { adminRegister, createSuperAdmin, createVendor } from "../controller/adminController";
import { auth } from "../middleware/auth";

const router = express.Router();
router.post("/create-admin", auth, adminRegister);

router.post("/create-vendors", auth,createVendor);

// router.post('/create-superadmin', auth,createSuperAdmin);

// router.get('/singleuser', auth, getSingleUser)

// router.patch('/update', auth, updateUSerProfile)

export default router;