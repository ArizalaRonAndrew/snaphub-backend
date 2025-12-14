// src/controllers/studentId.controller.js
import * as StudentModel from '../models/studentId.model.js';

// --- CREATE STUDENT ---
export const createStudentController = async (req, res) => {
    try {
        // ADDED: Retrieve authenticated user ID from the request object
        const userID = req.userID; 

        if (!userID) {
            // This is a safety check, but the route should be protected by middleware
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        // Handle potential missing files
        let photo_path = null;
        let signature_path = null;

        if (req.files?.photo?.[0]) {
            photo_path = req.files.photo[0].buffer;
        }

        if (req.files?.signature?.[0]) {
            signature_path = req.files.signature[0].buffer;
        }

        // Map req.body to the structure your model expects
        const data = {
            student_id: req.body.lrn, 
            first_name: req.body.firstname,
            middle_name: req.body.middlename,
            last_name: req.body.lastname,
            phone: req.body.phone,
            grade: req.body.grade,
            section: req.body.section,
            emergencycontact: req.body.emPhone,
            emergencyname: req.body.emName,
            address: req.body.emAddress,
            photo_path,
            signature_path,
            userID // ADDED: Include userID in the data for the model
        };

        const id = await StudentModel.createStudent(data);
        res.status(201).json({ success: true, id, message: "Student ID submitted successfully" });
    } catch (err) {
        console.error("Create Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- GET ALL STUDENTS ---
export const getAllStudentsController = async (req, res) => {
    try {
        const students = await StudentModel.getAllStudents();
        res.status(200).json({ success: true, students });
    } catch (err) {
        console.error("Fetch All Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- GET STUDENT BY ID ---
export const getStudentByIdController = async (req, res) => {
    try {
        const student = await StudentModel.getStudentById(req.params.id);
        if (!student)
            return res.status(404).json({ success: false, message: 'Not found' });

        res.status(200).json({ success: true, student });
    } catch (err) {
        console.error("Fetch One Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- NEW: GET APPLICATIONS BY USER/LRN ---
export const getStudentApplicationsByLRNController = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL path: /api/student-id/user/:id (This is the userID from the frontend)
        
        // This 'id' is now treated as the generic userID
        if (!id) {
             return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        // FIXED: Call the new model function that filters by userID
        const applications = await StudentModel.getStudentApplicationsByUserId(id);
        
        res.status(200).json({ success: true, applications });
    } catch (err) {
        console.error("Fetch User Applications Error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// --- UPDATE STUDENT (With Report Logic) ---
export const updateStudentController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        // Validation
        if (!status) {
             return res.status(400).json({ success: false, message: "No status provided" });
        }

        // Prepare data object for update
        const updateData = { status };

        // [IMPORTANT] Logic para sa Reports:
        // Kapag 'Approved' ang status, isave ang current date sa approved_at
        if (status === 'Approved') {
            updateData.approved_at = new Date(); 
        }

        // Ipasa ang updateData sa Model
        const affected = await StudentModel.updateStudent(id, updateData);

        if (!affected)
            return res.status(404).json({ success: false, message: "Student not found" });

        res.status(200).json({ success: true, message: "Student updated successfully" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- DELETE STUDENT ---
export const deleteStudentController = async (req, res) => {
    try {
        const affected = await StudentModel.deleteStudent(req.params.id);

        if (!affected)
            return res.status(404).json({ success: false, message: "Student not found" });

        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};