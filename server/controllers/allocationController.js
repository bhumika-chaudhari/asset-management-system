const Allocation = require("../models/allocationModel");
const asyncHandler = require("../utils/asyncHandler");

// ==============================
// Allocate Asset
// POST /api/allocations
// ==============================
const allocateAsset = asyncHandler(async (req, res) => {

    const {
        asset_id,
        employee_id,
        assigned_date
    } = req.body;

    if (!asset_id || !employee_id || !assigned_date) {

        return res.status(400).json({
            success: false,
            message: "Please provide all required fields."
        });

    }

    const result = await Allocation.allocateAsset({
        asset_id,
        employee_id,
        assigned_date
    });

    res.status(201).json({
        success: true,
        message: "Asset allocated successfully.",
        allocationId: result.insertId
    });

});

// ==============================
// Get All Allocations
// GET /api/allocations
// ==============================
const getAllocations = asyncHandler(async (req, res) => {

    const allocations = await Allocation.getAllAllocations();

    res.status(200).json({
        success: true,
        count: allocations.length,
        data: allocations
    });

});

module.exports = {
    allocateAsset,
    getAllocations
};