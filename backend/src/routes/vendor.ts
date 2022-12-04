import express from "express"
import { createFood, deleteFood, updateVendorProfile, vendorLogin, vendorProfile } from "../controller/vendorController"
import { authVendor} from "../middleware/authorization"
import { upload } from "../utils/multer";

const router = express.Router();

router.post("/login",vendorLogin)
router.post("/create-food" , authVendor, upload.single("image"),createFood)
router.get("/get-profile" , authVendor,vendorProfile)
router.delete("/delete-food/:foodid" , authVendor, deleteFood)
router.patch("/update-profile" , authVendor, upload.single("coverImage"), updateVendorProfile)



export default router