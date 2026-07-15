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

router.get(
    "/employees",
    authenticate,
    authorize("Admin"),
    reportController.getEmployeeAssetReport
);
router.get(
    "/maintenance",
    authenticate,
    authorize("Admin"),
    reportController.getMaintenanceReport
);
module.exports = router;