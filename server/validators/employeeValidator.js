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
  .matches(/^(\+91)?[6-9]\d{9}$/)
  .withMessage("Enter a valid Indian mobile number")

];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());
        console.log("Request Body:", req.body);

        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors.array(),
            body: req.body
        });
    }

    next();
};

module.exports = {
    employeeValidation,
    validate
};