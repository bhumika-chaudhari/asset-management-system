const express = require("express");

const router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

router.get("/", authenticate, maintenanceController.getAllMaintenance);

router.post(
    "/",
    authenticate,
    authorize("Admin"),
    maintenanceController.addMaintenance
);

router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    maintenanceController.completeMaintenance
);
module.exports = router;