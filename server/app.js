import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes.js";

// Load environment variables (safe to call here for dev/test)
dotenv.config();

const app = express();

// Configure CORS to restrict to FRONTEND_URL (allow no-origin requests like curl)
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., server-to-server, curl).
      if (!origin) return callback(null, true);
      if (origin === allowedOrigin) return callback(null, true);
      return callback(new Error("CORS policy: This origin is not allowed."));
    },
  })
);

app.use(express.json());

// Routes
app.use("/api/notes", noteRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

export default app;
