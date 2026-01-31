const reportsService = require("./reports.service");

async function handleReportRequest(serviceMethod, req, res, next, ...args) {
    try {
        const report = await serviceMethod(...args);

        if (!report) {
            return res.status(404).json({ error: "No data found for this period." });
        }

        res.set(report.headers);
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${report.fileName}`,
        );

        return res.send(report.fileBuffer);
    } catch (err) {
        next(err);
    }
}

async function getRangeReport(req, res, next) {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: "Dates required" });
    await handleReportRequest(
        reportsService.generateRangeReport,
        req,
        res,
        next,
        start,
        end,
    );
}

async function getLastMonthAll(req, res, next) {
    await handleReportRequest(
        reportsService.generateLastMonthAll,
        req,
        res,
        next,
    );
}

async function getLastMonthOverdue(req, res, next) {
    await handleReportRequest(
        reportsService.generateLastMonthOverdue,
        req,
        res,
        next,
    );
}

module.exports = { getRangeReport, getLastMonthAll, getLastMonthOverdue };