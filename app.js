import express from "express";
import cors from "cors";
import "dotenv/config.js";
import path from "path";
import { fileURLToPath } from "url";

// Import existing routes
import adminRouter from "./src/routes/admin.routes.js";
import BookingRouter from "./src/routes/booking.routes.js";
import studentIdRouter from "./src/routes/studentId.routes.js";

// Import NEW Service Router
import servicesRouter from "./src/routes/services.routes.js";

// Import Notification Router
import notificationRouter from "./src/routes/notification.routes.js";

// --- NEW: Import User Router ---
import userRouter from "./src/routes/user.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Allow serving of static files (Images) from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const allowedOrigins = [
  "http://localhost:5000",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/bookings", BookingRouter);
app.use("/api", studentIdRouter);

// New Service Routes
app.use("/api/services", servicesRouter);

// Register Notification Route
app.use("/api/notifications", notificationRouter);

// --- NEW: Register User Route ---
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  try {
    console.log(`Running on http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
