import express from "express";

import {  vendorLogin} from "../controller/vendorController";

import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/login", vendorLogin)

export default router;
