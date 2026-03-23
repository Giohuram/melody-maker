import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import "./config/database.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Backend server running on http://localhost:${config.port}`);
  console.log(`📡 CORS enabled for: ${config.frontendUrl}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
});

export default app;
