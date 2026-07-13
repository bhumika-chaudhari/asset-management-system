const express = require("express");

const router = express.Router();

const allocationController = require("../controllers/allocationController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// Get allocation history
router.get(
    "/",
    authenticate,
    allocationController.getAllocations
);

// Allocate asset
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    allocationController.allocateAsset
);

module.exports = router;