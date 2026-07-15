const Report = require("../models/reportModel");
const asyncHandler = require("../utils/asyncHandler");

// ======================================
// Asset Allocation Report
// ======================================
const getAllocationReport = asyncHandler(async (req, res) => {

    const report = await Report.getAllocationReport();

    res.status(200).json({
        success: true,
        count: report.length,
        data: report
    });

});
const getEmployeeAssetReport = asyncHandler(async (req, res) => {

    const report = await Report.getEmployeeAssetReport();

    res.status(200).json({
        success: true,
        count: report.length,
        data: report
    });

});
module.exports = {
    getAllocationReport,
    getEmployeeAssetReport
};