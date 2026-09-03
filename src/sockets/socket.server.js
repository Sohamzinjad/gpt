import { Server } from "socket.io";

function initSockerServer(httpServer) {
    const io = new Server(httpServer, {});

    // Placeholder middleware – can be extended for auth/logging
    io.use((socket, next) => {
        // For now just continue
        next();
    });

    io.on("connection", (socket) => {
        console.log("New User Connected", socket.id);
    });
}

export default initSockerServer;