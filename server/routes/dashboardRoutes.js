const express = require("express");

const router = express.Router();

const {
    getDashboardStats,
    getAssetStatusDistribution,
    getAssetCategoryDistribution,
} = require("../controllers/dashboardController");

router.get("/", getDashboardStats);

router.get(
    "/asset-status",
    getAssetStatusDistribution
);

router.get(
    "/asset-category",
    getAssetCategoryDistribution
);

module.exports = router;