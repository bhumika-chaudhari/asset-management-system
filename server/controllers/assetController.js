const Asset = require("../models/assetModel");

// GET all assets
exports.getAssets = (req, res) => {
    Asset.getAllAssets((err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

// GET asset by ID
exports.getAsset = (req, res) => {
    Asset.getAssetById(req.params.id, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

// POST asset
exports.createAsset = (req, res) => {
    Asset.addAsset(req.body, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Asset Added Successfully",
            id: result.insertId
        });
    });
};

// PUT asset
exports.updateAsset = (req, res) => {
    Asset.updateAsset(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Asset Updated Successfully"
        });
    });
};

// DELETE asset
exports.deleteAsset = (req, res) => {
    Asset.deleteAsset(req.params.id, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
            message: "Asset Deleted Successfully"
        });
    });
};