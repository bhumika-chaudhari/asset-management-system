const express = require("express");

const router = express.Router();

const assetController = require("../controllers/assetController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
router.get("/", authenticate, assetController.getAssets);

router.get("/:id", authenticate, assetController.getAsset);

router.post("/", authenticate, authorize("Admin"), assetController.createAsset);
router.put(
  "/:id",
  authenticate,
  authorize("Admin"),
  assetController.updateAsset,
);

router.delete(
  "/:id",
  authenticate,
  authorize("Admin"),
  assetController.deleteAsset,
);

module.exports = router;
