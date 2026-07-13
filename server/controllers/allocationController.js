const Allocation = require("../models/allocationModel");
const asyncHandler = require("../utils/asyncHandler");

// Allocate Asset
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

// Get All Allocations
const getAllocations = asyncHandler(async (req, res) => {

    const allocations = await Allocation.getAllAllocations();

    res.status(200).json({
        success: true,
        count: allocations.length,
        data: allocations
    });

});

// Return Asset
const returnAsset = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Allocation.returnAsset(id);

    res.status(200).json({
        success: true,
        message: "Asset returned successfully."
    });

});

module.exports = {
    allocateAsset,
    getAllocations,
    returnAsset
};