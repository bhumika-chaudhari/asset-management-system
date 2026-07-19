const Audit = require("../models/auditModel");
const asyncHandler = require("../utils/asyncHandler");
const { generateHash } = require("../utils/blockchain");

// ======================================
// Get All Audit Logs
// ======================================
const getAuditLogs = asyncHandler(async (req, res) => {

    const logs = await Audit.getAuditLogs();

    res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
    });

});

// ======================================
// Verify Blockchain Integrity
// ======================================
const verifyBlockchain = asyncHandler(async (req, res) => {

    const logs = await Audit.getAuditLogs();

    if (logs.length === 0) {
        return res.status(200).json({
            success: true,
            valid: true,
            message: "Blockchain is empty."
        });
    }

    let previousHash = "GENESIS_BLOCK";

    for (const block of logs) {

        // Verify chain link
        if (block.previous_hash !== previousHash) {
            return res.status(200).json({
                success: true,
                valid: false,
                message: `Blockchain broken at Block #${block.id}`
            });
        }

        // Recalculate current hash
        const recalculatedHash = generateHash(
            JSON.stringify({
                action: block.action,
                entity: block.entity,
                entity_id: block.entity_id,
                description: block.description,
                user_id: block.user_id,
                previous_hash: block.previous_hash
            })
        );

        // Verify block hash
        if (recalculatedHash !== block.current_hash) {
            return res.status(200).json({
                success: true,
                valid: false,
                message: `Block #${block.id} has been tampered.`
            });
        }

        previousHash = block.current_hash;
    }

    res.status(200).json({
        success: true,
        valid: true,
        message: "Blockchain verified successfully."
    });

});

module.exports = {
    getAuditLogs,
    verifyBlockchain
};