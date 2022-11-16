import express from "express";
import { Register } from "../controller/userController";

const router = express.Router();
router.post("/register", Register);

export default router;