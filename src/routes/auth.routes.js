import express from "express"
import { registerUser } from "../controllers/auth.controller.js";
const router = express.Router();


router.post("/register", authController.registerUser);
router.post("/login" , authController.loginUser)


module.exports = router;
