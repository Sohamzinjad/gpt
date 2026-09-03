import chatModel from "../DB/Models/chat.model.js";
import userModel from "../DB/Models/user.model.js";

async function createChat(req, res) {
    const { title, user } = req.body;

    const userExists = await userModel.findById(user);
    if (!userExists) {
        return res.status(404).json({ message: "User not found" });
    }

    const chat = await chatModel.create({
        user,
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
}

export { createChat };
