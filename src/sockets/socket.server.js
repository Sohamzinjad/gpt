import { Server } from "socket.io";
import * as cookie from "cookie"
import jwt from "jsonwebtoken"
import userModel from "../DB/Models/user.model.js";
import * as aiService from "../service/ai.service.js";
import messageModel from "../DB/Models/message.model.js";

function initSockerServer(httpServer) {
    const io = new Server(httpServer, {});

    // Placeholder middleware – can be extended for auth/logging
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        if (!cookies.token) {
            return next(new Error("Unauthorized"));

        }

        try {
            const verifiedToken = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(verifiedToken.id);
            if (!user) {
                throw new Error('User not found');
            }
            socket.userId = user._id;
            next();
        } catch (err) {
            console.log(err);
            return next(new Error('Unauthorized'));
        }
    });

    io.on("connection", (socket) => {
        socket.on("join", async (messagePayload) => {
            console.log(messagePayload)


            await messageModel.create({
                user: socket.userId,
                chatId: messagePayload.chatId,
                sender: socket.userId,
                receiver: messagePayload.receiver,
                content: messagePayload.message,
                role: "user"
            })

            const chatHistory = await messageModel.find({
                chatId: messagePayload.chatId
            })

            console.log("chatHistory", chatHistory.map(item => {
                return {
                    role: item.role,
                    parts: [{ text: item.content }]
                }
            }))


            const response = await aiService.genrateResponse(messagePayload.message)
            await messageModel.create({
                user: socket.userId,
                chatId: messagePayload.chatId,
                sender: socket.userId,
                receiver: messagePayload.receiver,
                content: response,
                role: "model"
            })

            console.log(response)


            socket.emit('ai-response', {
                content: response,
                chatId: messagePayload.chatId
            })
        })
    });
}

export default initSockerServer;