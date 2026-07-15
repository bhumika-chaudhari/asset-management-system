const db = require("../config/db");

// ======================================
// Asset Allocation Report
// ======================================
const getAllocationReport = async () => {

    const [rows] = await db.query(`
        SELECT
            al.id,
            ast.asset_name,
            ast.serial_number,
            emp.employee_code,
            emp.name AS employee_name,
            emp.department,
            al.assigned_date,
            al.return_date,
            al.status
        FROM allocations al
        INNER JOIN assets ast
            ON al.asset_id = ast.id
        INNER JOIN employees emp
            ON al.employee_id = emp.id
        ORDER BY al.assigned_date DESC
    `);

    return rows;
};

// ======================================
// Employee Asset Report
// ======================================
const getEmployeeAssetReport = async () => {

    const [rows] = await db.query(`
        SELECT
            e.id AS employee_id,
            e.employee_code,
            e.name AS employee_name,
            e.department,
            COUNT(a.id) AS total_assets
        FROM employees e
        LEFT JOIN allocations a
            ON e.id = a.employee_id
            AND a.status = 'Assigned'
        GROUP BY
            e.id,
            e.employee_code,
            e.name,
            e.department
        ORDER BY total_assets DESC
    `);

    return rows;
};

// ======================================
// Maintenance Report
// ======================================
const getMaintenanceReport = async () => {

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
        INNER JOIN assets a
            ON m.asset_id = a.id
        ORDER BY m.maintenance_date DESC
    `);

    return rows;
};

// ======================================
// Dashboard Report
// ======================================
const getDashboardReport = async () => {

    const [[totalAssets]] = await db.query(
        "SELECT COUNT(*) AS totalAssets FROM assets"
    );

    const [[availableAssets]] = await db.query(
        "SELECT COUNT(*) AS availableAssets FROM assets WHERE status='Available'"
    );

    const [[assignedAssets]] = await db.query(
        "SELECT COUNT(*) AS assignedAssets FROM assets WHERE status='Assigned'"
    );

    const [[maintenanceAssets]] = await db.query(
        "SELECT COUNT(*) AS maintenanceAssets FROM assets WHERE status='Maintenance'"
    );

    const [[employees]] = await db.query(
        "SELECT COUNT(*) AS totalEmployees FROM employees"
    );

    const [[allocations]] = await db.query(
        "SELECT COUNT(*) AS totalAllocations FROM allocations"
    );

    const [[maintenanceCost]] = await db.query(
        "SELECT IFNULL(SUM(cost),0) AS totalMaintenanceCost FROM maintenance"
    );

    return {
        totalAssets: totalAssets.totalAssets,
        availableAssets: availableAssets.availableAssets,
        assignedAssets: assignedAssets.assignedAssets,
        maintenanceAssets: maintenanceAssets.maintenanceAssets,
        totalEmployees: employees.totalEmployees,
        totalAllocations: allocations.totalAllocations,
        totalMaintenanceCost: maintenanceCost.totalMaintenanceCost
    };

};

module.exports = {
    getAllocationReport,
    getEmployeeAssetReport,
    getMaintenanceReport,
    getDashboardReport
};