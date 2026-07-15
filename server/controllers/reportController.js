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

// ======================================
// Employee Asset Report
// ======================================
const getEmployeeAssetReport = asyncHandler(async (req, res) => {

    const report = await Report.getEmployeeAssetReport();

    res.status(200).json({
        success: true,
        count: report.length,
        data: report
    });

});

// ======================================
// Maintenance Report
// ======================================
const getMaintenanceReport = asyncHandler(async (req, res) => {

    const report = await Report.getMaintenanceReport();

    const totalCost = report.reduce(
        (sum, item) => sum + Number(item.cost),
        0
    );

    res.status(200).json({
        success: true,
        count: report.length,
        totalCost,
        data: report
    });

});

// ======================================
// Dashboard Analytics Report
// ======================================
const getDashboardReport = asyncHandler(async (req, res) => {

    const dashboard = await Report.getDashboardReport();

    res.status(200).json({
        success: true,
        data: dashboard
    });

});

module.exports = {
    getAllocationReport,
    getEmployeeAssetReport,
    getMaintenanceReport,
    getDashboardReport
};