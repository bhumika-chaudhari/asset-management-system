const { body, validationResult } = require("express-validator");

const employeeValidation = [

    body("employee_code")
        .notEmpty()
        .withMessage("Employee code is required"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("department")
        .trim()
        .notEmpty()
        .withMessage("Department is required"),

    body("designation")
        .trim()
        .notEmpty()
        .withMessage("Designation is required"),

    body("email")
        .isEmail()
        .withMessage("Valid email is required"),

    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone must be 10 digits")

];

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            errors: errors.array()
        });

    }

    next();
};

module.exports = {
    employeeValidation,
    validate
};