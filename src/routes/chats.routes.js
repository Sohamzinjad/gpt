import express from "express"
import authUser  from "../middleware.js/auth.middleware.js"
import chatController from "../controllers/chat.controller.js"

const router = express.Router()



router.post("/" , authMiddleware.authUser , chatController.createChat.createChat)


module.export = router  