import express from "express";
import authUser from "../middleware.js/auth.middleware.js";
import { createChat, getChats, getChatMessages } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/", authUser, createChat);
router.get("/", authUser, getChats);
router.get("/:chatId/messages", authUser, getChatMessages);

export default router;