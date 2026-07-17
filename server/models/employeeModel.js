const db = require("../config/db");

// Get all employees
const getAllEmployees = async (filters) => {

    let sql = "SELECT * FROM employees WHERE 1=1";
    let countSql = "SELECT COUNT(*) AS total FROM employees WHERE 1=1";

    let values = [];
    let countValues = [];

    if (filters.search) {
        sql += `
            AND (
                name LIKE ?
                OR employee_code LIKE ?
                OR department LIKE ?
                OR designation LIKE ?
            )
        `;

        countSql += `
            AND (
                name LIKE ?
                OR employee_code LIKE ?
                OR department LIKE ?
                OR designation LIKE ?
            )
        `;

        const keyword = `%${filters.search}%`;

        values.push(keyword, keyword, keyword, keyword);
        countValues.push(keyword, keyword, keyword, keyword);
    }

    sql += " ORDER BY id DESC LIMIT ? OFFSET ?";

    values.push(filters.limit);
    values.push(filters.offset);

    const [rows] = await db.query(sql, values);

    const [[count]] = await db.query(countSql, countValues);

    return {
        employees: rows,
        total: count.total,
    };
};

// Get employee by ID
const getEmployeeById = async (id) => {

    const [rows] = await db.query(
        "SELECT * FROM employees WHERE id=?",
        [id]
    );

    return rows;
};

// Create employee
const createEmployee = async (employee) => {

    const sql = `
    INSERT INTO employees
    (
        employee_code,
        name,
        department,
        designation,
        email,
        phone
    )
    VALUES (?,?,?,?,?,?)
    `;

    const [result] = await db.query(sql, [

        employee.employee_code,
        employee.name,
        employee.department,
        employee.designation,
        employee.email,
        employee.phone

    ]);

    return result;

};

// Update employee
const updateEmployee = async (id, employee) => {

    const sql = `
    UPDATE employees
    SET

    employee_code=?,
    name=?,
    department=?,
    designation=?,
    email=?,
    phone=?

    WHERE id=?
    `;

    const [result] = await db.query(sql, [

        employee.employee_code,
        employee.name,
        employee.department,
        employee.designation,
        employee.email,
        employee.phone,
        id

    ]);

    return result;

};

// Delete employee
const deleteEmployee = async (id) => {

    const [result] = await db.query(
        "DELETE FROM employees WHERE id=?",
        [id]
    );

    return result;

};

module.exports = {

    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee

};