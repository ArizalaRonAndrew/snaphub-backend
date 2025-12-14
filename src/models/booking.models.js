// src/models/booking.models.js
import pool from "../config/db.js";
import { createNotification } from "./notification.model.js"; 

// Get all bookings
export const getAllBookings = async () => {
    // FIX: All indentation is removed from the query string to prevent errors
    const query = `SELECT 
b.bookingID, 
b.userID,
b.fullname,
b.email,
b.phonenumber,
b.location,
b.date,
b.time,
b.category,
b.Package_type,
b.details,
b.status,
MAX(p.packagePrice) AS packagePrice 
FROM bookingtbl b
LEFT JOIN packagetbl p ON b.Package_type = p.packageName
GROUP BY 
b.bookingID, b.userID, b.fullname, b.email, b.phonenumber, b.location, 
b.date, b.time, b.category, b.Package_type, b.details, b.status
ORDER BY b.date ASC`;
    
    const [rows] = await pool.query(query);
    return rows;
};

// Get booking by ID (assuming this is BookingID, not UserID)
export const getBookingById = async (id) => { 
    const [rows] = await pool.query("SELECT * FROM bookingtbl WHERE bookingID = ?", [ 
        id,
    ]);
    return rows[0];
};

// NEW: Get all bookings by User ID
export const getAllBookingsByUserId = async (userID) => {
    const [rows] = await pool.query("SELECT * FROM bookingtbl WHERE userID = ?", [
        userID,
    ]);
    return rows;
};

// Create new booking
export const createBooking = async (booking) => {
    const {
        userID, 
        fullname,
        email,
        phonenumber,
        location,
        date,
        time,
        category,
        Package_type, 
        details,
        status,
    } = booking;

    // FIX: Entire SQL string is now left-aligned and compact to eliminate whitespace errors
    const [result] = await pool.query(
        `INSERT INTO bookingtbl (userID, fullname, email, phonenumber, location, date, time, category, Package_type, details, status) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            userID, 
            fullname,
            email,
            phonenumber,
            location,
            date,
            time,
            category,
            Package_type,
            details,
            status || "Pending",
        ]
    );

    // --- NEW: Trigger Notification ---
    const message = `📅 New Booking: ${category} for ${fullname}`;
    try {
        await createNotification("booking", result.insertId, message); // Notification trigger
    } catch (error) {
        console.error("Failed to create notification for booking:", error);
    }

    return result.insertId;
};

// Update booking
export const updateBooking = async (id, data) => { 
    const fields = Object.keys(data)
        .map((key) => `${key} = ?`)
        .join(", ");
    const values = [...Object.values(data), id]; 

    if (fields.length === 0) return 0;

    const sql = `UPDATE bookingtbl SET ${fields} WHERE bookingID = ?`; 

    const [result] = await pool.query(sql, values);
    return result.affectedRows;
};

// Delete booking
export const deleteBooking = async (id) => { 
    const [result] = await pool.query("DELETE FROM bookingtbl WHERE bookingID = ?", [ 
        id,
    ]);
    return result.affectedRows;
};

// Check availability based on status
export const checkDateAvailability = async (date) => {
    // FIX: All indentation is removed from the query string to prevent errors
    const sql = `SELECT * FROM bookingtbl 
WHERE date = ? 
AND status IN ('Pending', 'Confirmed')
    `;
    
    const [rows] = await pool.query(sql, [date]);
    
    return rows.length === 0;
};