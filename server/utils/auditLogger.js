/*
This function will:

Read the previous hash.
Generate a new SHA-256 hash.
Save the new block in audit_logs.
*/
const Audit = require("../models/auditModel");
const { generateHash } = require("./blockchain");

const logAction = async ({
    action,
    entity,
    entity_id,
    description,
    user_id
}) => {

    // Get previous block hash
    const previous_hash = await Audit.getLastHash();

    // Create block data
    const blockData = JSON.stringify({
        action,
        entity,
        entity_id,
        description,
        user_id,
        previous_hash,
        timestamp: Date.now()
    });

    // Generate current hash
    const current_hash = generateHash(blockData);

    // Save block
    await Audit.createAuditLog({
        action,
        entity,
        entity_id,
        description,
        user_id,
        previous_hash,
        current_hash
    });

};

module.exports = {
    logAction
};