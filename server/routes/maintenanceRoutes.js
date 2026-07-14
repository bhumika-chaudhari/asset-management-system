const express = require("express");

const router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// ===============================
// Get All Maintenance Records
// ===============================
router.get(
    "/",
    authenticate,
    maintenanceController.getAllMaintenance
);

// ===============================
// Add Maintenance Record
// ===============================
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    maintenanceController.addMaintenance
);

module.exports = router;