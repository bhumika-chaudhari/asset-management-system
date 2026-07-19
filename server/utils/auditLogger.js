const Audit = require("../models/auditModel");
const { generateHash } = require("./blockchain");

const logAction = async ({
    action,
    entity,
    entity_id,
    description,
    user_id
}) => {

    const previous_hash = await Audit.getLastHash();

    const blockData = JSON.stringify({
        action,
        entity,
        entity_id,
        description,
        user_id,
        previous_hash
    });

    const current_hash = generateHash(blockData);

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