const Asset = require("../models/assetModel");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// ======================================
// Get All Assets
// ======================================
const getAllAssets = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const filters = {
        search: req.query.search || "",
        status: req.query.status || "",
        category: req.query.category || "",
        limit,
        offset
    };

    const result = await Asset.getAllAssets(filters);

    res.status(200).json({
        success: true,
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        data: result.assets
    });

});

// ======================================
// Get Asset By ID
// ======================================
const getAsset = asyncHandler(async (req, res) => {

    const asset = await Asset.getAssetById(req.params.id);

    if (asset.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Asset not found"
        });
    }

    res.status(200).json({
        success: true,
        data: asset[0]
    });

});

// ======================================
// Create Asset
// ======================================
const createAsset = asyncHandler(async (req, res) => {

    const result = await Asset.addAsset(req.body);

    await logAction({
        action: "CREATE",
        entity: "Asset",
        entity_id: result.insertId,
        description: `Created Asset: ${req.body.asset_name}`,
        user_id: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: "Asset created successfully",
        assetId: result.insertId
    });

});

// ======================================
// Update Asset
// ======================================
const updateAsset = asyncHandler(async (req, res) => {

    const result = await Asset.updateAsset(req.params.id, req.body);

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Asset not found"
        });
    }

    await logAction({
        action: "UPDATE",
        entity: "Asset",
        entity_id: req.params.id,
        description: `Updated Asset: ${req.body.asset_name}`,
        user_id: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "Asset updated successfully"
    });

});

// ======================================
// Delete Asset
// ======================================
const deleteAsset = asyncHandler(async (req, res) => {

    // Check active allocation
    const activeAllocation =
        await Asset.getActiveAllocation(req.params.id);

    if (activeAllocation) {

        return res.status(400).json({
            success: false,
            message: "Cannot delete an allocated asset."
        });

    }

    // Check active maintenance
    const activeMaintenance =
        await Asset.getActiveMaintenance(req.params.id);

    if (activeMaintenance) {

        return res.status(400).json({
            success: false,
            message: "Asset is currently under maintenance."
        });

    }

    // Delete asset
    const result = await Asset.deleteAsset(req.params.id);

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "Asset not found"
        });
    }

    await logAction({
        action: "DELETE",
        entity: "Asset",
        entity_id: req.params.id,
        description: "Deleted Asset",
        user_id: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "Asset deleted successfully"
    });

});

module.exports = {
    getAllAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset
};