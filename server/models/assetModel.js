const db = require("../config/db");

// Get all assets
const getAllAssets = (callback) => {
    const sql = "SELECT * FROM assets";
    db.query(sql, callback);
};

// Get asset by ID
const getAssetById = (id, callback) => {
    const sql = "SELECT * FROM assets WHERE id = ?";
    db.query(sql, [id], callback);
};

// Add new asset
const addAsset = (asset, callback) => {
    const sql = `
        INSERT INTO assets
        (asset_name, category, serial_number, purchase_date, status, asset_condition, location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        asset.asset_name,
        asset.category,
        asset.serial_number,
        asset.purchase_date,
        asset.status,
        asset.asset_condition,
        asset.location
    ], callback);
};

// Update asset
const updateAsset = (id, asset, callback) => {
    const sql = `
        UPDATE assets
        SET asset_name=?,
            category=?,
            serial_number=?,
            purchase_date=?,
            status=?,
            asset_condition=?,
            location=?
        WHERE id=?
    `;

    db.query(sql, [
        asset.asset_name,
        asset.category,
        asset.serial_number,
        asset.purchase_date,
        asset.status,
        asset.asset_condition,
        asset.location,
        id
    ], callback);
};

// Delete asset
const deleteAsset = (id, callback) => {
    const sql = "DELETE FROM assets WHERE id=?";
    db.query(sql, [id], callback);
};

module.exports = {
    getAllAssets,
    getAssetById,
    addAsset,
    updateAsset,
    deleteAsset
};