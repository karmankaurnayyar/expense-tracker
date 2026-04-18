// server.js – Entry point for the Express application
require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const authRoutes   = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());          // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/expenses", expenseRoutes);

// Health-check endpoint (useful for Render / Railway)
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404 handler – catch-all for unknown routes
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
