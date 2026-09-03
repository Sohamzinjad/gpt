import app from "./src/app.js";
import { config } from "dotenv";
config({path: "./.env"})
import connectDB from "./src/DB/db.js";
import initSockerServer from "./src/sockets/socket.server.js";
import {createServer} from "http";


const httpServer = createServer(app)

initSockerServer(httpServer)
connectDB()

httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000");
})