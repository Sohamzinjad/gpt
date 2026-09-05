import { Server } from "socket.io";
import * as cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../DB/Models/user.model.js";
import * as aiService from "../service/ai.service.js";
import messageModel from "../DB/Models/message.model.js";
import chatModel from "../DB/Models/chat.model.js";

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const cookies = (cookie.parseCookie ? cookie.parseCookie(rawCookie) : (cookie.parse ? cookie.parse(rawCookie) : {})) || {};
            const token = cookies.token || socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Unauthorized: Token missing"));
            }

            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(verifiedToken.id);
            if (!user) {
                return next(new Error("Unauthorized: User not found"));
            }
            socket.userId = user._id;
            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket authentication error:", err.message);
            return next(new Error("Unauthorized: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        // Optional room join for multi-tab or room broadcast
        socket.on("join-chat", (chatId) => {
            if (chatId) {
                socket.join(chatId.toString());
            }
        });

        // Common handler for incoming message
        const handleMessage = async (messagePayload) => {
            try {
                if (!messagePayload || !messagePayload.chatId || !messagePayload.message) {
                    return socket.emit("error", { message: "Both chatId and message are required" });
                }

                // 1. Save incoming user message
                await messageModel.create({
                    user: socket.userId,
                    chatId: messagePayload.chatId,
                    sender: socket.userId,
                    receiver: messagePayload.receiver,
                    content: messagePayload.message,
                    role: "user"
                });

                // 2. Fetch full conversation history
                const chatHistory = await messageModel.find({
                    chatId: messagePayload.chatId
                }).sort({ createdAt: 1 });

                const formattedHistory = chatHistory.map(item => ({
                    role: item.role === "model" ? "model" : "user",
                    parts: [{ text: item.content }]
                }));

                // 3. Generate AI response with history context
                const aiGenerator = aiService.generateResponse || aiService.genrateResponse;
                const response = await aiGenerator(
                    formattedHistory.length > 0 ? formattedHistory : messagePayload.message
                );

                // 4. Save AI model response
                await messageModel.create({
                    user: socket.userId,
                    chatId: messagePayload.chatId,
                    sender: socket.userId,
                    receiver: messagePayload.receiver,
                    content: response,
                    role: "model"
                });

                // 5. Update chat's last activity
                await chatModel.findByIdAndUpdate(messagePayload.chatId, { lastActivity: new Date() });

                // 6. Emit AI response back to client
                socket.emit("ai-response", {
                    content: response,
                    chatId: messagePayload.chatId
                });
            } catch (error) {
                console.error("Error processing socket message:", error);
                socket.emit("error", { message: error.message || "Failed to generate AI response" });
            }
        };

        // Support both "join" (for compatibility) and standard "message" event
        socket.on("join", handleMessage);
        socket.on("message", handleMessage);
        socket.on("send-message", handleMessage);
    });

    return io;
}

const initSockerServer = initSocketServer;

export { initSocketServer, initSockerServer };
export default initSocketServer;