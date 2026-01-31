const express = require("express");
const router = express.Router();
const controller = require("./reports.controller");

/**
 * REPORT 1: Specific Period Export
 * URL: GET /api/reports/export?start=2024-01-01&end=2024-01-31
 * Description: Exports all borrowings between two user-defined dates.
 */
router.get("/export", controller.getRangeReport);

/**
 * REPORT 2: Last Month All Processes
 * URL: GET /api/reports/last-month-all
 * Description: Automatically calculates the previous calendar month and exports all activity.
 */
router.get("/last-month-all", controller.getLastMonthAll);

/**
 * REPORT 3: Last Month Overdue
 * URL: GET /api/reports/last-month-overdue
 * Description: Automatically exports books that were overdue specifically in the last month.
 */
router.get("/last-month-overdue", controller.getLastMonthOverdue);

module.exports = router;