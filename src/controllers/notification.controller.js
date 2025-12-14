// src/controllers/notification.controller.js
import * as NotifModel from "../models/notification.model.js";

export const getNotifs = async (req, res) => {
    try {
        const data = await NotifModel.getNotifications();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const readNotif = async (req, res) => {
    try {
        await NotifModel.markAsRead(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const readAll = async (req, res) => {
    try {
        await NotifModel.markAllAsRead();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// NEW: Delete Notification Controller
export const deleteNotif = async (req, res) => {
    try {
        const affectedRows = await NotifModel.deleteNotification(req.params.id);
        
        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        
        res.json({ success: true, message: "Notification deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};