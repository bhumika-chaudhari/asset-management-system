const db = require("../config/db");

// Get all assets
const getAllAssets = async (filters) => {

    let sql = "SELECT * FROM assets WHERE 1=1";

    let values = [];

    // Search by asset name
    if (filters.search) {

        sql += " AND asset_name LIKE ?";

        values.push(`%${filters.search}%`);

    }

    // Filter by status
    if (filters.status) {

        sql += " AND status = ?";

        values.push(filters.status);

    }

    // Filter by category
    if (filters.category) {

        sql += " AND category = ?";

        values.push(filters.category);

    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql, values);

    return rows;

};

// Get asset by ID
const getAssetById = async (id) => {
    const [rows] = await db.query(
        "SELECT * FROM assets WHERE id = ?",
        [id]
    );
    return rows;
};

// Add new asset
const addAsset = async (asset) => {
    const sql = `
        INSERT INTO assets
        (asset_name, category, serial_number, purchase_date, status, asset_condition, location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        asset.asset_name,
        asset.category,
        asset.serial_number,
        asset.purchase_date,
        asset.status,
        asset.asset_condition,
        asset.location
    ]);

    return result;
};

// Update asset
const updateAsset = async (id, asset) => {
    const sql = `
        UPDATE assets
        SET
            asset_name = ?,
            category = ?,
            serial_number = ?,
            purchase_date = ?,
            status = ?,
            asset_condition = ?,
            location = ?
        WHERE id = ?
    `;

    const [result] = await db.query(sql, [
        asset.asset_name,
        asset.category,
        asset.serial_number,
        asset.purchase_date,
        asset.status,
        asset.asset_condition,
        asset.location,
        id
    ]);

    return result;
};

// Delete asset
const deleteAsset = async (id) => {
    const [result] = await db.query(
        "DELETE FROM assets WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    getAllAssets,
    getAssetById,
    addAsset,
    updateAsset,
    deleteAsset
};