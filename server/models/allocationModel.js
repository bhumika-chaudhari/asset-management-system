const db = require("../config/db");

// Get asset by ID
const getAssetById = async (assetId) => {
    const [rows] = await db.query(
        "SELECT * FROM assets WHERE id = ?",
        [assetId]
    );

    return rows[0];
};

// Get employee by ID
const getEmployeeById = async (employeeId) => {
    const [rows] = await db.query(
        "SELECT * FROM employees WHERE id = ?",
        [employeeId]
    );

    return rows[0];
};

// Allocate Asset (Transaction)
const allocateAsset = async ({ asset_id, employee_id, assigned_date }) => {

    const connection = await db.getConnection();

    try {

        // Start Transaction
        await connection.beginTransaction();

        // Check Asset
        const [assetRows] = await connection.query(
            "SELECT * FROM assets WHERE id = ?",
            [asset_id]
        );

        if (assetRows.length === 0) {
            throw new Error("Asset not found");
        }

        // Check Employee
        const [employeeRows] = await connection.query(
            "SELECT * FROM employees WHERE id = ?",
            [employee_id]
        );

        if (employeeRows.length === 0) {
            throw new Error("Employee not found");
        }

        // Check Asset Status
        if (assetRows[0].status !== "Available") {
            throw new Error("Asset is already assigned or under maintenance");
        }

        // Insert Allocation
        const [allocationResult] = await connection.query(
            `INSERT INTO allocations
            (asset_id, employee_id, assigned_date)
            VALUES (?, ?, ?)`,
            [
                asset_id,
                employee_id,
                assigned_date
            ]
        );

        // Update Asset Status
        await connection.query(
            "UPDATE assets SET status='Assigned' WHERE id=?",
            [asset_id]
        );

        // Commit Transaction
        await connection.commit();

        return allocationResult;

    } catch (error) {

        // Rollback if any query fails
        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }
};

// Get All Allocations
const getAllAllocations = async () => {

    const [rows] = await db.query(`
        SELECT
            a.id,
            ast.asset_name,
            ast.serial_number,
            e.name AS employee_name,
            e.department,
            a.assigned_date,
            a.return_date,
            a.status
        FROM allocations a
        JOIN assets ast
            ON a.asset_id = ast.id
        JOIN employees e
            ON a.employee_id = e.id
        ORDER BY a.id DESC
    `);

    return rows;
};

module.exports = {
    getAssetById,
    getEmployeeById,
    allocateAsset,
    getAllAllocations
};