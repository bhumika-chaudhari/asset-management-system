const db = require("../config/db");

// ======================================
// Get Asset by ID
// ======================================
const getAssetById = async (assetId) => {
    const [rows] = await db.query(
        "SELECT * FROM assets WHERE id = ?",
        [assetId]
    );

    return rows[0];
};

// ======================================
// Get Employee by ID
// ======================================
const getEmployeeById = async (employeeId) => {
    const [rows] = await db.query(
        "SELECT * FROM employees WHERE id = ?",
        [employeeId]
    );

    return rows[0];
};

// ======================================
// Check Active Allocation
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
// Allocate Asset
// ======================================
const allocateAsset = async ({ asset_id, employee_id, assigned_date }) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        // Lock Asset Row
        const [assetRows] = await connection.query(
            "SELECT * FROM assets WHERE id=? FOR UPDATE",
            [asset_id]
        );

        if (assetRows.length === 0) {
            throw new Error("Asset not found");
        }

        // Employee Exists?
        const [employeeRows] = await connection.query(
            "SELECT * FROM employees WHERE id=?",
            [employee_id]
        );

        if (employeeRows.length === 0) {
            throw new Error("Employee not found");
        }

        // Already Allocated?
        const [activeAllocation] = await connection.query(
            `
            SELECT id
            FROM allocations
            WHERE asset_id=?
            AND return_date IS NULL
            FOR UPDATE
            `,
            [asset_id]
        );

        if (activeAllocation.length > 0) {
            throw new Error("Asset is already allocated.");
        }

        if (assetRows[0].status !== "Available") {
            throw new Error("Asset is not available.");
        }

        // Create Allocation
        const [allocationResult] = await connection.query(
            `
            INSERT INTO allocations
            (
                asset_id,
                employee_id,
                assigned_date
            )
            VALUES (?,?,?)
            `,
            [
                asset_id,
                employee_id,
                assigned_date
            ]
        );

        // Update Asset Status
        await connection.query(
            `
            UPDATE assets
            SET status='Assigned'
            WHERE id=?
            `,
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

// ======================================
// Get All Allocations
// ======================================
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

// ======================================
// Return Asset
// ======================================
const returnAsset = async (allocationId) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const [allocationRows] = await connection.query(
            `
            SELECT *
            FROM allocations
            WHERE id=?
            FOR UPDATE
            `,
            [allocationId]
        );

        if (allocationRows.length === 0) {
            throw new Error("Allocation not found");
        }

        const allocation = allocationRows[0];

        if (allocation.status === "Returned") {
            throw new Error("Asset already returned");
        }

        // Update Allocation
        await connection.query(
            `
            UPDATE allocations
            SET
                status='Returned',
                return_date=CURDATE()
            WHERE id=?
            `,
            [allocationId]
        );

        // Update Asset Status
        await connection.query(
            `
            UPDATE assets
            SET status='Available'
            WHERE id=?
            `,
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
    getActiveAllocation,
    allocateAsset,
    getAllAllocations,
    returnAsset
};