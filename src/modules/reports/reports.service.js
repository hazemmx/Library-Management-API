const reportsRepo = require("./reports.repository");
const ExcelJS = require("exceljs");

/**
 * Generic Engine to build the Report Package
 * This ensures consistency across all report types
 */
async function buildReportPackage(data, defaultName) {
    if (!data || data.length === 0) return null;

    // 1. Analytics Logic
    const total = data.length;
    const returned = data.filter((item) => item.Status === "Returned").length;
    const analytics = {
        "X-Report-Total": total.toString(),
        "X-Report-Returned": returned.toString(),
        "X-Report-Non-Returned": (total - returned).toString(),
        "X-Report-Success-Rate": total > 0 ? ((returned / total) * 100).toFixed(2) + "%" : "0%",
    };

    // 2. Excel Logic
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Library Report");

    // Auto-map columns from SQL aliases
    worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key.toUpperCase().replace("_", " "),
        key: key,
        width: 25,
    }));
    worksheet.addRows(data);

    const buffer = await workbook.xlsx.writeBuffer();

    return {
        headers: analytics,
        fileBuffer: buffer,
        fileName: `${defaultName}.xlsx`,
    };
}

// Logic Orchestrators
async function generateRangeReport(start, end) {
    const data = await reportsRepo.getBorrowingsByRange(start, end);
    return await buildReportPackage(data, `Report_${start}_to_${end}`);
}

async function generateLastMonthAll() {
    const data = await reportsRepo.getLastMonthProcesses();
    return await buildReportPackage(data, "Last_Month_All_Activity");
}

async function generateLastMonthOverdue() {
    const data = await reportsRepo.getLastMonthOverdue();
    return await buildReportPackage(data, "Last_Month_Overdue_Report");
}

module.exports = {
    generateRangeReport,
    generateLastMonthAll,
    generateLastMonthOverdue,
};