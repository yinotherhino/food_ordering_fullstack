import express from "express";
import { getAllUsers, getSingleUser } from "../controller/getUsers";
import {  Register, verifyUser } from "../controller/userController";

const router = express.Router();
router.post("/register", Register);

router.post("/verify/:signature", verifyUser);

router.get('/', getAllUsers)

router.get('/:id', getSingleUser)

export default router;