import userModel from "../DB/Models/user.model.js";
import jwt from "jsonwebtoken";

async function authUser(req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodedToken.id);
    next();
}

export default authUser;;