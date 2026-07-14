
const Asset = require("../models/assetModel");
const asyncHandler = require("../utils/asyncHandler");

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
    getAllAssets,
    getAsset,
    createAsset,
    updateAsset,
    deleteAsset
};