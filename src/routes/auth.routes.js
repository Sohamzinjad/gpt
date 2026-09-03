import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import authUser from "../middleware.js/auth.middleware.js";
import createChat from "../controllers/chat.controller.js";
import userModel from "../DB/Models/user.model.js";
import chatModel from "../DB/Models/chat.model.js";
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/", authUser, createChat);


module.exports = router;
