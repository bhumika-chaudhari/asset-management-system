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

module.exports = router;