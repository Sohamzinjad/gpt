import { Server } from "socket.io";
import * as cookie from "cookie"
import jwt from "jsonwebtoken"

function initSockerServer(httpServer) {
    const io = new Server(httpServer, {});

    // Placeholder middleware – can be extended for auth/logging
    io.use((socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        if (!cookies.token) {
            return next(new Error("Unauthorized"));
        }
        
        try{ 
            const verfiedToken = jwt.verify(cookies.token , process.env.JWT_SECRET)
            socket.userId = verfiedToken.id 
        }catch(err){
            console.log(err)
            return next(new Error("Unauthorized"))
        }
        // For now just continue
        next();
    });

    io.on("connection", (socket) => {
        console.log("New User Connected", socket.id);
    });
}

export default initSockerServer;