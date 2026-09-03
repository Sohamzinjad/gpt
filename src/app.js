import express from "express";
import cookieParser  from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import chatsRoutes from "./routes/chats.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser())


app.use('/api/auth' , authRoutes)
app.use('/api/chats' , chatsRoutes)

// routes
app.get("/", (req,res) => {
    res.send("Hello World!")
})




export default app