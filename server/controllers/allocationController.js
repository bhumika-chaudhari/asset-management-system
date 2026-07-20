const Allocation = require("../models/allocationModel");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// ======================================
// Allocate Asset
// ======================================
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

    // Blockchain Log
    await logAction({
        action: "ALLOCATE",
        entity: "Allocation",
        entity_id: result.insertId,
        description: `Allocated Asset ${asset_id} to Employee ${employee_id}`,
        user_id: req.user.id
    });

    res.status(201).json({
        success: true,
        message: "Asset allocated successfully.",
        allocationId: result.insertId
    });

});

// ======================================
// Get All Allocations
// ======================================
const getAllocations = asyncHandler(async (req, res) => {

    const allocations = await Allocation.getAllAllocations();

    res.status(200).json({
        success: true,
        count: allocations.length,
        data: allocations
    });

});

// ======================================
// Return Asset
// ======================================
const returnAsset = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Allocation.returnAsset(id);

    await logAction({
        action: "RETURN",
        entity: "Allocation",
        entity_id: id,
        description: `Returned Allocation ${id}`,
        user_id: req.user.id
    });

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