// src/controllers/user.controller.js - UPDATED
import UserModel from "../models/user.model.js";

// 1. LOGIN User
export const loginUser = async (req, res) => {
    const { userName, userPassword } = req.body;

    try {
        const user = await UserModel.login(userName);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify Password
        if (user.userPassword !== userPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
        // FIX: Inject a token into the response. (Replace with JWT generation in production)
        const token = "DUMMY_USER_TOKEN_FOR_" + user.userID; 

        res.json({ 
            success: true,
            message: "Login successful", 
            token, // <-- ADDED TOKEN
            // Ginamit na ang 'userName' property para tugma sa frontend
            user: { id: user.userID, userName: user.userName } 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... (Rest of the controller functions remain the same) ...
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.getById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    const { userName, userPassword } = req.body;

    if (!userName || !userPassword) {
        return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
        const newId = await UserModel.create(userName, userPassword);
        res.status(201).json({ 
            id: newId, 
            userName, 
            message: "User created successfully" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { userName, userPassword } = req.body;
    try {
        const affectedRows = await UserModel.update(id, userName, userPassword);
        if (affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const affectedRows = await UserModel.delete(req.params.id);
        if (affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};