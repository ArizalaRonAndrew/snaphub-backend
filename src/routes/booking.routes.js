import express from "express";
import {
    getBookings,
    getBooking,
    createBookingController,
    updateBookingController,
    deleteBookingController,
    checkAvailabilityController,
    getUserBookingsController // <<< Added Import
} from "../controllers/booking.controller.js";

// FIX 1: Import Authentication Middleware Placeholder
import { authenticateUser } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Utility routes (Moved before /:id for correct routing)
router.get("/check-availability", checkAvailabilityController);  // NEW ROUTE (Must be before /:id)
router.get("/user/:userID", getUserBookingsController);          // FIX 2: Moved before /:id route

// FIX 3: ADD AUTHENTICATION MIDDLEWARE TO THE CREATE ROUTE
router.post("/", authenticateUser, createBookingController);    // Create booking (NOW PROTECTED)


// CRUD routes
router.get("/", getBookings);                                    // Get all bookings
router.get("/:id", getBooking);                                  // Get booking by ID
router.put("/:id", updateBookingController);                     // Update booking
router.delete("/:id", deleteBookingController);                  // Delete booking

export default router;