const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// ======================================
// Asset Allocation Report
// ======================================
router.get(
    "/allocations",
    authenticate,
    authorize("Admin"),
    reportController.getAllocationReport
);

// ======================================
// Employee Asset Report
// ======================================
router.get(
    "/employees",
    authenticate,
    authorize("Admin"),
    reportController.getEmployeeAssetReport
);

// ======================================
// Maintenance Report
// ======================================
router.get(
    "/maintenance",
    authenticate,
    authorize("Admin"),
    reportController.getMaintenanceReport
);

// ======================================
// Dashboard Report
// ======================================
router.get(
    "/dashboard",
    authenticate,
    authorize("Admin"),
    reportController.getDashboardReport
);

module.exports = router;