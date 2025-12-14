/**
 * DUMMY AUTHENTICATION MIDDLEWARE FOR TESTING.
 * This should be replaced with robust JWT verification logic (e.g., using 'jsonwebtoken') in production.
 * It currently extracts the user ID from the dummy token structure set in user.controller.js.
 */
export const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication token missing. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const DUMMY_PREFIX = 'DUMMY_USER_TOKEN_FOR_';

    // Dummy verification
    if (token.startsWith(DUMMY_PREFIX)) {
        // Extract the user ID 
        const userID = token.replace(DUMMY_PREFIX, ''); 
        
        // CRUCIAL: Attach userID to the request object for booking.controller.js
        req.userID = userID;
        
        next(); // Proceed to the controller
    } else {
        res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }
};