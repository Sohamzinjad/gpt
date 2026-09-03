import express from "express"
import authUser  from "../middleware.js/auth.middleware.js"

const router = express.Router()



router.post("/" , authMiddleware.authUser)


module.export = router  