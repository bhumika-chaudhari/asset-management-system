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
    entity_id: Number(entity_id),
    description,
    user_id: Number(user_id),
    previous_hash
});
console.log("========== CREATED BLOCK ==========");
console.log(blockData);

const current_hash = generateHash(blockData);

console.log("Hash:", current_hash);

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