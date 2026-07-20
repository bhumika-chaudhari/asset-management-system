const db = require("../config/db");

// ======================================
// Add Maintenance
// ======================================
const addMaintenance = async (maintenance) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Check Asset
        const [assetRows] = await connection.query(
            "SELECT * FROM assets WHERE id=?",
            [maintenance.asset_id]
        );

        if (assetRows.length === 0) {
            throw new Error("Asset not found");
        }

        const asset = assetRows[0];

        // Prevent duplicate maintenance
        const [existing] = await connection.query(
            `
            SELECT *
            FROM maintenance
            WHERE asset_id=?
            AND status='Pending'
            LIMIT 1
            `,
            [maintenance.asset_id]
        );

        if (existing.length > 0) {
            throw new Error("Asset is already under maintenance.");
        }

        // Save maintenance
        const [result] = await connection.query(
            `
            INSERT INTO maintenance
            (
                asset_id,
                maintenance_date,
                description,
                cost,
                status,
                previous_status
            )
            VALUES (?,?,?,?,?,?)
            `,
            [
                maintenance.asset_id,
                maintenance.maintenance_date,
                maintenance.description,
                maintenance.cost,
                maintenance.status || "Pending",
                asset.status
            ]
        );

        // Change asset status
        await connection.query(
            `
            UPDATE assets
            SET status='Maintenance'
            WHERE id=?
            `,
            [maintenance.asset_id]
        );

        await connection.commit();

        return result;

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};

// ======================================
// Get All Maintenance
// ======================================
const getAllMaintenance = async () => {

    const [rows] = await db.query(`
        SELECT
            m.id,
            m.asset_id,
            a.asset_name,
            a.serial_number,
            m.maintenance_date,
            m.description,
            m.cost,
            m.status,
            m.previous_status
        FROM maintenance m
        JOIN assets a
            ON m.asset_id = a.id
        ORDER BY m.id DESC
    `);

    return rows;

};

// ======================================
// Complete Maintenance
// ======================================
const completeMaintenance = async (maintenanceId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [maintenanceRows] = await connection.query(
            `
            SELECT *
            FROM maintenance
            WHERE id=?
            `,
            [maintenanceId]
        );

        if (maintenanceRows.length === 0) {
            throw new Error("Maintenance record not found");
        }

        const maintenance = maintenanceRows[0];

        if (maintenance.status === "Completed") {
            throw new Error("Maintenance already completed");
        }

        // Complete maintenance
        await connection.query(
            `
            UPDATE maintenance
            SET status='Completed'
            WHERE id=?
            `,
            [maintenanceId]
        );

        // Restore previous asset status
        await connection.query(
            `
            UPDATE assets
            SET status=?
            WHERE id=?
            `,
            [
                maintenance.previous_status,
                maintenance.asset_id
            ]
        );

        await connection.commit();

        return true;

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};
// Check if an asset already has an active maintenance
const getActiveMaintenance = async (assetId) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM maintenance
        WHERE asset_id = ?
        AND status != 'Completed'
        LIMIT 1
        `,
        [assetId]
    );

    return rows[0];
};
module.exports = {
    addMaintenance,
    getAllMaintenance,
    completeMaintenance,
    getActiveMaintenance
};