import express from "express";
import {auth} from '../middleware/authorization'
import { AdminRegister,createVendor,SuperAdmin } from "../controller/adminController";

const router = express.Router();

router.post('/create-admin', auth, AdminRegister)
router.post('/create-super-admin',SuperAdmin)
router.post('/create-vendors',auth,createVendor)

export default router;