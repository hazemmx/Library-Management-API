const express = require("express");
require("dotenv").config();
const helmet = require("helmet");
// Import Routes
const bookRoutes = require("./modules/books/books.routes");
const borrowerRoutes = require("./modules/borrowers/borrowers.routes");
const borrowingRoutes = require("./modules/borrowings/borrowings.routes");
const reportRoutes = require("./modules/reports/reports.routes");

const app = express();

app.use(helmet());

// Global Middleware
app.use(express.json()); // Parses incoming JSON requests

// Health Check (Good for testing if server is alive)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Library System is running" });
});

// Register Module Routes
app.use("/api/books", bookRoutes);
app.use("/api/borrowers", borrowerRoutes);
app.use("/api/borrowings", borrowingRoutes);
app.use("/api/reports", reportRoutes);

// 404 Handler (When route doesn't exist)
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Centralized Error Handler (Bonus: Shows good design)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});

module.exports = app;