import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "model"],
        default: "user"
    }
}, {
    timestamps: true
});

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;