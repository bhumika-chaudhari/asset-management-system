const crypto = require("crypto");

function createBlockData(block) {
    return JSON.stringify({
        action: block.action,
        entity: block.entity,
        entity_id: Number(block.entity_id),
        description: block.description,
        user_id: Number(block.user_id),
        previous_hash: block.previous_hash
    });
}

function generateHash(data) {
    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

module.exports = {
    generateHash,
    createBlockData
};
//this code convert any value 
//It converts any text into a SHA256 hash.
/*
Example

generateHash("Hello")

returns

185f8db32271fe25...
*/