import express from "express";
import multer from "multer";
import { 
  createStudentController, 
  getAllStudentsController, 
  getStudentByIdController,
  updateStudentController, 
  deleteStudentController,
  getStudentApplicationsByLRNController 
} from "../controllers/studentId.controller.js";

// NEW IMPORT: Import the authentication middleware
import { authenticateUser } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- ROUTES ---

// 1. Create Application (FIXED: Added authenticateUser middleware)
router.post(
  "/student-id",
  authenticateUser, // <--- ADDED: Apply authentication middleware here
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createStudentController
);

// 2. Get All Applications
router.get("/student-id", getAllStudentsController);

// 3. Get Single Student
router.get("/student-id/:id", getStudentByIdController);

// 4. Approve/Update Status
router.put("/student-id/:id", updateStudentController);

// 5. Delete Application
router.delete("/student-id/:id", deleteStudentController);

// NEW ROUTE: Get applications by User ID (or LRN)
// Assuming this route is also protected:
router.get("/student-id/user/:id", authenticateUser, getStudentApplicationsByLRNController); 

export default router;