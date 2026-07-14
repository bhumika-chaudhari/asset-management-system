const db = require("../config/db");

// Add Maintenance Record
const addMaintenance = async (maintenance) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Check asset exists
        const [assetRows] = await connection.query(
            "SELECT * FROM assets WHERE id = ?",
            [maintenance.asset_id]
        );

        if (assetRows.length === 0) {
            throw new Error("Asset not found");
        }

        // Insert maintenance record
        const [result] = await connection.query(
            `INSERT INTO maintenance
            (asset_id, maintenance_date, description, cost, status)
            VALUES (?, ?, ?, ?, ?)`,
            [
                maintenance.asset_id,
                maintenance.maintenance_date,
                maintenance.description,
                maintenance.cost,
                maintenance.status || "Pending"
            ]
        );

        // Update asset status
        await connection.query(
            "UPDATE assets SET status='Maintenance' WHERE id=?",
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

// Get All Maintenance Records
const getAllMaintenance = async () => {

    const [rows] = await db.query(`
        SELECT
            m.id,
            a.asset_name,
            a.serial_number,
            m.maintenance_date,
            m.description,
            m.cost,
            m.status
        FROM maintenance m
        JOIN assets a
            ON m.asset_id = a.id
        ORDER BY m.id DESC
    `);

    return rows;

};

module.exports = {
    addMaintenance,
    getAllMaintenance
};