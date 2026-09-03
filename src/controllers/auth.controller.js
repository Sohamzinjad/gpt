import userModel from "../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
    const { email, fullName, lastName, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ email, fullName, lastName, password: hashPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token);
    return res.status(201).json({
        message: "User created successfully",
        user: { email: newUser.email, _id: newUser._id, fullName: newUser.fullName },
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token);
    return res.status(200).json({
        message: "User logged in successfully",
        user: { email: user.email, _id: user._id, fullName: user.fullName },
    });
}

export { registerUser, loginUser };