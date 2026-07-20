const db = require("../config/db");

const getAllAssets = async (filters) => {

    let sql = "SELECT * FROM assets WHERE 1=1";
    let countSql = "SELECT COUNT(*) AS total FROM assets WHERE 1=1";

    let values = [];
    let countValues = [];

    // Search
    if (filters.search) {
        sql += " AND asset_name LIKE ?";
        countSql += " AND asset_name LIKE ?";
        values.push(`%${filters.search}%`);
        countValues.push(`%${filters.search}%`);
    }

    // Status Filter
    if (filters.status) {
        sql += " AND status = ?";
        countSql += " AND status = ?";
        values.push(filters.status);
        countValues.push(filters.status);
    }

    // Category Filter
    if (filters.category) {
        sql += " AND category = ?";
        countSql += " AND category = ?";
        values.push(filters.category);
        countValues.push(filters.category);
    }

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";

    values.push(filters.limit);
    values.push(filters.offset);

    const [rows] = await db.query(sql, values);
    const [[count]] = await db.query(countSql, countValues);

    return {
        assets: rows,
        total: count.total
    };
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
// Get only available assets
const getAvailableAssets = async () => {
    const [rows] = await db.query(`
        SELECT *
        FROM assets
        WHERE status = 'Available'
        ORDER BY asset_name
    `);

    return rows;
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
    deleteAsset,
    getAvailableAssets
};