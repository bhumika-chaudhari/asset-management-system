const Maintenance = require("../models/maintenanceModel");
const asyncHandler = require("../utils/asyncHandler");

// ===============================
// Add Maintenance Record
// ===============================
const addMaintenance = asyncHandler(async (req, res) => {

    const {
        asset_id,
        maintenance_date,
        description,
        cost,
        status
    } = req.body;

    // Validation
    if (!asset_id || !maintenance_date || !description || cost == null) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields."
        });
    }

    const result = await Maintenance.addMaintenance({
        asset_id,
        maintenance_date,
        description,
        cost,
        status
    });

    res.status(201).json({
        success: true,
        message: "Maintenance record created successfully.",
        maintenanceId: result.insertId
    });

});

// ===============================
// Get All Maintenance Records
// ===============================
const getAllMaintenance = asyncHandler(async (req, res) => {

    const records = await Maintenance.getAllMaintenance();

    res.status(200).json({
        success: true,
        count: records.length,
        data: records
    });

});
const completeMaintenance = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await Maintenance.completeMaintenance(id);

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