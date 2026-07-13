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

        await connection.beginTransaction();

        const [assetRows] = await connection.query(
            "SELECT * FROM assets WHERE id = ?",
            [asset_id]
        );

        if (assetRows.length === 0) {
            throw new Error("Asset not found");
        }

        const [employeeRows] = await connection.query(
            "SELECT * FROM employees WHERE id = ?",
            [employee_id]
        );

        if (employeeRows.length === 0) {
            throw new Error("Employee not found");
        }

        if (assetRows[0].status !== "Available") {
            throw new Error("Asset is already assigned or under maintenance");
        }

        const [allocationResult] = await connection.query(
            `INSERT INTO allocations
            (asset_id, employee_id, assigned_date)
            VALUES (?, ?, ?)`,
            [asset_id, employee_id, assigned_date]
        );

        await connection.query(
            "UPDATE assets SET status='Assigned' WHERE id=?",
            [asset_id]
        );

        await connection.commit();

        return allocationResult;

    } catch (error) {

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

// Return Asset (Transaction)
const returnAsset = async (allocationId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [allocationRows] = await connection.query(
            "SELECT * FROM allocations WHERE id = ?",
            [allocationId]
        );

        if (allocationRows.length === 0) {
            throw new Error("Allocation not found");
        }

        const allocation = allocationRows[0];

        if (allocation.status === "Returned") {
            throw new Error("Asset already returned");
        }

        await connection.query(
            `UPDATE allocations
             SET status='Returned',
                 return_date=CURDATE()
             WHERE id=?`,
            [allocationId]
        );

        await connection.query(
            `UPDATE assets
             SET status='Available'
             WHERE id=?`,
            [allocation.asset_id]
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

module.exports = {
    getAssetById,
    getEmployeeById,
    allocateAsset,
    getAllAllocations,
    returnAsset
};
