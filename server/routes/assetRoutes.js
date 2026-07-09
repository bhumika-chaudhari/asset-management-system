const express = require("express");

const router = express.Router();

const assetController = require("../controllers/assetController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, assetController.getAssets);

router.get("/:id", authenticate, assetController.getAsset);

router.post("/", authenticate, assetController.createAsset);

router.put("/:id", authenticate, assetController.updateAsset);

router.delete("/:id", authenticate, assetController.deleteAsset);

module.exports = router;