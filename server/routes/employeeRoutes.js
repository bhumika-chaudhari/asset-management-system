const express = require("express");

const router = express.Router();

const employeeController = require("../controllers/employeeController");
const {
    employeeValidation,
    validate
} = require("../validators/employeeValidator");
const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// Everyone logged in can view employees
router.get(
    "/",
    authenticate,
    employeeController.getEmployees
);

router.get(
    "/:id",
    authenticate,
    employeeController.getEmployee
);

// Only Admin can modify
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    employeeValidation,
    validate,
    employeeController.createEmployee
);
router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    employeeValidation,
    validate,
    employeeController.updateEmployee
);

router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    employeeController.deleteEmployee
);

module.exports = router;