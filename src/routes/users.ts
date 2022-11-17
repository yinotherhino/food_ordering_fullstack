import express from "express";
import { Register, verifyUser } from "../controller/userController";

const router = express.Router();
router.post("/register", Register);

router.post("/verify/:signature", verifyUser);

export default router;