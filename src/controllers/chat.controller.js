import chatModel from "../DB/Models/chat.model.js";
import userModel from "../DB/Models/user.model.js";
import messageModel from "../DB/Models/message.model.js";

async function createChat(req, res) {
    try {
        const userId = req.user?._id || req.body.user;
        const { title } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userExists = await userModel.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        const chat = await chatModel.create({
            user: userId,
            title: title || "New Chat",
        });

        return res.status(201).json({
            message: "Chat created successfully",
            chat: {
                _id: chat._id,
                user: chat.user,
                title: chat.title,
                lastActivity: chat.lastActivity,
            },
        });
    } catch (error) {
        console.error("Error in createChat:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getChats(req, res) {
    try {
        const userId = req.user?._id;
        const chats = await chatModel.find({ user: userId }).sort({ lastActivity: -1 });
        return res.status(200).json({ chats });
    } catch (error) {
        console.error("Error in getChats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        const messages = await messageModel.find({ chatId }).sort({ createdAt: 1 });
        return res.status(200).json({ messages });
    } catch (error) {
        console.error("Error in getChatMessages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { createChat, getChats, getChatMessages };
