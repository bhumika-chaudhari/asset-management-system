const Employee = require("../models/employeeModel");
const asyncHandler=require("../utils/asyncHandler");
// Get all employees
const getEmployees = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const offset = (page - 1) * limit;

    const search = req.query.search || "";

    const result = await Employee.getAllEmployees({
        page,
        limit,
        offset,
        search,
    });

    res.status(200).json({
        success: true,
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        data: result.employees,
    });

});
// Get employee by ID
const getEmployee = async (req, res) => {

    try {

        const employee = await Employee.getEmployeeById(req.params.id);

        if (employee.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            data: employee[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Create employee
const createEmployee = async (req, res) => {

    try {

        const result = await Employee.createEmployee(req.body);

        res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employeeId: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update employee
const updateEmployee = async (req, res) => {

    try {

        const result = await Employee.updateEmployee(
            req.params.id,
            req.body
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete employee
const deleteEmployee = async (req, res) => {

    try {

        const result = await Employee.deleteEmployee(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
};