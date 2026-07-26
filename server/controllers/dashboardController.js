const asyncHandler = require("../utils/asyncHandler");
const Dashboard = require("../models/dashboardModel");

const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await Dashboard.getDashboardStats();

    res.status(200).json({
        success: true,
        data: stats,
    });

});
const getAssetStatusDistribution = asyncHandler(async (req, res) => {

    const data =
        await Dashboard.getAssetStatusDistribution();

    res.status(200).json({
        success: true,
        data,
    });

});
const getAssetCategoryDistribution = asyncHandler(async (req, res) => {

    const data =
        await Dashboard.getAssetCategoryDistribution();

    res.status(200).json({
        success: true,
        data,
    });

});
module.exports = {
    getDashboardStats,
    getAssetStatusDistribution,
    getAssetCategoryDistribution,
};