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
module.exports = {
    getAllocationReport,
    getEmployeeAssetReport
};

/*
allocations
      │
      ├──────── assets
      │
      └──────── employees


this returnss like 
| Asset | Employee | Department | Assigned Date | Return Date | Status |
| ----- | -------- | ---------- | ------------- | ----------- | ------ |

*/