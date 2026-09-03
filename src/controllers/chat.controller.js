import chatModel from "../DB/Models/chat.model";
import userModel from "../DB/Models/user.model";

async function createChat(req, res) {
    const {title} = req.body
    const {user} = req.body

    const userExists = await userModel.findById(user)
    if(!userExists){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const chat = await chatModel.create({
        user,
        title: "New Chat"
    })

    return res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id : chat._id,
            user : chat.user,
            title : chat.title,
            lastActivity : chat.lastActivity
        }
    })

}

module.exports = createChat
