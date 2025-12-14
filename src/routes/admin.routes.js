import express from "express";
import { registerUser, loginUser } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/register", registerUser);
adminRouter.post("/login", loginUser);

export default adminRouter;
