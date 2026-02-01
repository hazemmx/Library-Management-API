const reportsService = require("./reports.service");

async function handleReportRequest(serviceMethod, req, res, next, ...args) {
  try {
    const report = await serviceMethod(...args);

    // Check if report data exists
    if (!report || !report.fileBuffer) {
      return res.status(404).json({
        success: false,
        error: "No records found",
        message: "No data available for the specified criteria",
      });
    }

    // Set response headers for Excel file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.fileName}"`,
    );

    // Send the Excel file buffer
    return res.status(200).send(report.fileBuffer);
  } catch (err) {
    // Handle specific error types
    if (err.message.includes("Invalid date")) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format",
        message: "Please provide dates in YYYY-MM-DD format",
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: "Report generation failed",
      message: err.message || "An error occurred while generating the report",
    });
  }
}

async function getRangeReport(req, res, next) {
  try {
    const { start, end } = req.query;

    // Validate required parameters
    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters",
        message: "Both start and end dates are required",
      });
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format",
        message: "Please provide dates in YYYY-MM-DD format",
      });
    }

    // Validate date logic (end date should be after start date)
    if (new Date(end) < new Date(start)) {
      return res.status(400).json({
        success: false,
        error: "Invalid date range",
        message: "End date must be after start date",
      });
    }

    await handleReportRequest(
      reportsService.generateRangeReport,
      req,
      res,
      next,
      start,
      end,
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Report generation failed",
      message: err.message || "Failed to generate borrowing report",
    });
  }
}

async function getLastMonthAll(req, res, next) {
  try {
    await handleReportRequest(
      reportsService.generateLastMonthAll,
      req,
      res,
      next,
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Export failed",
      message: err.message || "Failed to generate activity report",
    });
  }
}

async function getLastMonthOverdue(req, res, next) {
  try {
    await handleReportRequest(
      reportsService.generateLastMonthOverdue,
      req,
      res,
      next,
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Export failed",
      message: err.message || "Failed to generate overdue report",
    });
  }
}

module.exports = { getRangeReport, getLastMonthAll, getLastMonthOverdue };
