const db = require("../config/db");

const getLastHash = async () => {

    const [rows] = await db.query(
        `SELECT current_hash
         FROM audit_logs
         ORDER BY id DESC
         LIMIT 1`
    );

    if (rows.length === 0) {
        return "GENESIS_BLOCK";
    }

    return rows[0].current_hash;
};

const createAuditLog = async (audit) => {

    const {
        action,
        entity,
        entity_id,
        description,
        user_id,
        previous_hash,
        current_hash
    } = audit;

    const [result] = await db.query(
        `
        INSERT INTO audit_logs
        (
            action,
            entity,
            entity_id,
            description,
            user_id,
            previous_hash,
            current_hash
        )
        VALUES (?,?,?,?,?,?,?)
        `,
        [
            action,
            entity,
            entity_id,
            description,
            user_id,
            previous_hash,
            current_hash
        ]
    );

    return result;
};

const getAuditLogs = async () => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM audit_logs
        ORDER BY id DESC
        `
    );

    return rows;
};

module.exports = {
    getLastHash,
    createAuditLog,
    getAuditLogs,
};