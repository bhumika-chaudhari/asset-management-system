const Maintenance = require("../models/maintenanceModel");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// ======================================
// Add Maintenance
// ======================================
const addMaintenance = asyncHandler(async (req, res) => {

    const {
        asset_id,
        maintenance_date,
        description,
        cost,
        status
    } = req.body;

    if (!asset_id || !maintenance_date || !description || cost == null) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields."
        });
    }

    // Prevent duplicate maintenance
    const existing = await Maintenance.getActiveMaintenance(asset_id);

    if (existing) {
        return res.status(400).json({
            success: false,
            message: "This asset is already under maintenance."
        });
    }

    const result = await Maintenance.addMaintenance({
        asset_id,
        maintenance_date,
        description,
        cost,
        status
    });

    await logAction({
        action: "CREATE",
        entity: "Maintenance",
        entity_id: result.insertId,
        description: `Maintenance created for Asset ID ${asset_id}`,
        user_id: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: "Maintenance record created successfully.",
        maintenanceId: result.insertId
    });

});

// ======================================
// Get All Maintenance
// ======================================
const getAllMaintenance = asyncHandler(async (req, res) => {

    const records = await Maintenance.getAllMaintenance();

    res.status(200).json({
        success: true,
        count: records.length,
        data: records
    });

});

// ======================================
// Complete Maintenance
// ======================================
const completeMaintenance = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Maintenance.completeMaintenance(id);

    await logAction({
        action: "COMPLETE",
        entity: "Maintenance",
        entity_id: id,
        description: `Completed Maintenance ID ${id}`,
        user_id: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "Maintenance completed successfully."
    });

});

module.exports = {
    addMaintenance,
    getAllMaintenance,
    completeMaintenance
};