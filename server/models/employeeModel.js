const db = require("../config/db");

// Get all employees
const getAllEmployees = async () => {

    const [rows] = await db.query(
        "SELECT * FROM employees ORDER BY id DESC"
    );

    return rows;
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