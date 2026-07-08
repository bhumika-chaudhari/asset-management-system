const Asset = require("../models/assetModel");

// GET all assets
const getAssets = async (req, res) => {
    try {
        const assets = await Asset.getAllAssets();

        res.status(200).json({
            success: true,
            count: assets.length,
            data: assets
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch assets"
        });
    }
};

// GET asset by ID
const getAsset = async (req, res) => {
    try {
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

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch asset"
        });
    }
};

// CREATE asset
const createAsset = async (req, res) => {
    try {
        const result = await Asset.addAsset(req.body);

        res.status(201).json({
            success: true,
            message: "Asset created successfully",
            assetId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create asset"
        });
    }
};

// UPDATE asset
const updateAsset = async (req, res) => {
    try {
        const result = await Asset.updateAsset(req.params.id, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset updated successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update asset"
        });
    }
};

// DELETE asset
const deleteAsset = async (req, res) => {
    try {
        const result = await Asset.deleteAsset(req.params.id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete asset"
        });
    }
};

module.exports = {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset
};