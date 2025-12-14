import { Router } from "express";
import { 
    loginUser,
    getUsers, 
    getUserById, // Now this will work because it exists in the controller
    createUser, 
    updateUser, 
    deleteUser 
} from "../controllers/user.controller.js";

const router = Router();

router.post("/login", loginUser); // Login Route
router.get("/", getUsers);        // Get All
router.get("/:id", getUserById);  // Get One
router.post("/", createUser);     // Register
router.put("/:id", updateUser);   // Update
router.delete("/:id", deleteUser);// Delete

export default router;