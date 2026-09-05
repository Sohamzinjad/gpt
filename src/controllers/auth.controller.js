import userModel from "../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function registerUser(req, res) {
    try {
        const { email, fullName, lastName, password } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "Email, fullName, and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            email,
            fullName,
            lastName: lastName || "",
            password: hashPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            message: "User created successfully",
            user: { email: newUser.email, _id: newUser._id, fullName: newUser.fullName },
            token
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({
            message: "User logged in successfully",
            user: { email: user.email, _id: user._id, fullName: user.fullName },
            token
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { registerUser, loginUser };