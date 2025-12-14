import bcrypt from "bcrypt";
import { findUserByUsername, createUser } from "../models/admin.model.js";

export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existing = await findUserByUsername(username);
        if (existing) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        await createUser(username, hashed);
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user.id, username: user.username }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
