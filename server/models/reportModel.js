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

module.exports = {
    getAllocationReport
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