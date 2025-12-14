// src/routes/notification.routes.js
import express from "express";
import { getNotifs, readNotif, readAll, deleteNotif } from "../controllers/notification.controller.js"; // ADDED deleteNotif

const router = express.Router();

router.get("/", getNotifs);
router.put("/:id/read", readNotif);
router.put("/read-all", readAll);
router.delete("/:id", deleteNotif); // NEW: DELETE route

export default router;