const express = require("express");
const router = express.Router();

const assetController = require("../controllers/assetController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// Get all assets
router.get(
    "/",
    authenticate,
    assetController.getAllAssets
);

// Get asset by ID
router.get(
    "/:id",
    authenticate,
    assetController.getAsset
);

// Create asset
router.post(
    "/",
    authenticate,
    authorize("Admin"),
    assetController.createAsset
);

// Update asset
router.put(
    "/:id",
    authenticate,
    authorize("Admin"),
    assetController.updateAsset
);

// Delete asset
router.delete(
    "/:id",
    authenticate,
    authorize("Admin"),
    assetController.deleteAsset
);

module.exports = router;