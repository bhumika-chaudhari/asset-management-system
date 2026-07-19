const express = require("express");

const router = express.Router();

const auditController = require("../controllers/auditController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

// ======================================
// Get All Audit Logs
// ======================================
router.get(
    "/",
    authenticate,
    authorize("Admin"),
    auditController.getAuditLogs
);

// ======================================
// Verify Blockchain
// ======================================
router.get(
    "/verify",
    authenticate,
    authorize("Admin"),
    auditController.verifyBlockchain
);

module.exports = router;