import * as BookingModel from "../models/booking.models.js";

// Get all bookings
export const getBookings = async (req, res) => {
    try {
        const bookings = await BookingModel.getAllBookings();
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        console.error("Get Bookings Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get booking by ID
export const getBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel.getBookingById(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
        res.status(200).json({ success: true, booking });
    } catch (err) {
        console.error("Get Booking Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// NEW: Get bookings by User ID
export const getUserBookingsController = async (req, res) => {
    try {
        const { userID } = req.params; // Get ID from URL path: /api/bookings/user/:userID
        
        // Input validation
        if (!userID) {
             return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        const bookings = await BookingModel.getAllBookingsByUserId(userID);
        
        res.status(200).json({ success: true, bookings });
    } catch (err) {
        console.error("Get User Bookings Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Create booking
export const createBookingController = async (req, res) => {
    try {
        // FIX: Retrieve authenticated user ID from the request object
        const userID = req.userID; 

        if (!userID) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        
        // req.body contains all fields including Package_type from frontend
        const bookingData = req.body;
        
        // Combine booking data with the authenticated userID
        const bookingWithID = { ...bookingData, userID }; 

        // Pass the complete object to the model
        const id = await BookingModel.createBooking(bookingWithID); 
        res.status(201).json({ success: true, message: "Booking created", id });
    } catch (err) {
        console.error("Create Booking Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update booking
export const updateBookingController = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await BookingModel.updateBooking(id, req.body);
        
        if (affectedRows === 0) return res.status(404).json({ success: false, message: "Booking not found" });
        
        res.status(200).json({ success: true, message: "Booking updated successfully" });
    } catch (err) {
        console.error("Update Booking Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete booking
export const deleteBookingController = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await BookingModel.deleteBooking(id);
        if (affectedRows === 0) return res.status(404).json({ success: false, message: "Booking not found" });
        res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (err) {
        console.error("Delete Booking Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- NEW CONTROLLER: Check Availability ---
export const checkAvailabilityController = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, message: "Date is required" });
        }

        const isAvailable = await BookingModel.checkDateAvailability(date);

        res.status(200).json({ success: true, available: isAvailable });
    } catch (err) {
        console.error("Check Availability Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};