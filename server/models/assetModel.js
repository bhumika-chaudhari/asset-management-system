const db = require("../config/db");

// ======================================
// Get All Assets
// ======================================
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

// ======================================
// Get Asset By ID
// ======================================
const getAssetById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM assets WHERE id=?",
        [id]
    );

    return rows;

};

// ======================================
// Add Asset
// ======================================
const addAsset = async (asset) => {

    const sql = `
        INSERT INTO assets
        (
            asset_name,
            category,
            serial_number,
            purchase_date,
            status,
            asset_condition,
            location
        )
        VALUES (?,?,?,?,?,?,?)
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

// ======================================
// Update Asset
// ======================================
const updateAsset = async (id, asset) => {

    const sql = `
        UPDATE assets
        SET
            asset_name=?,
            category=?,
            serial_number=?,
            purchase_date=?,
            status=?,
            asset_condition=?,
            location=?
        WHERE id=?
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

// ======================================
// Delete Asset
// ======================================
const deleteAsset = async (id) => {

    const [result] = await db.query(
        "DELETE FROM assets WHERE id=?",
        [id]
    );

    return result;

};

// ======================================
// Active Allocation
// ======================================
const getActiveAllocation = async (assetId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM allocations
        WHERE asset_id = ?
        AND return_date IS NULL
        LIMIT 1
        `,
        [assetId]
    );

    return rows[0];

};

// ======================================
// Active Maintenance
// ======================================
const getActiveMaintenance = async (assetId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM maintenance
        WHERE asset_id = ?
        AND status='Pending'
        LIMIT 1
        `,
        [assetId]
    );

    return rows[0];

};

module.exports = {
    getAllAssets,
    getAssetById,
    addAsset,
    updateAsset,
    deleteAsset,
    getActiveAllocation,
    getActiveMaintenance
};