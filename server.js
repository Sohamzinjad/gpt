import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/DB/db.js";
import initSocketServer from "./src/sockets/socket.server.js";
import { createServer } from "http";

const httpServer = createServer(app);

initSocketServer(httpServer);
connectDB();

httpServer.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});