const db = require("../config/db");

// Find user by email
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows;
};

// Create user
const createUser = async (user) => {

    const sql = `
        INSERT INTO users
        (name,email,password,role)
        VALUES (?,?,?,?)
    `;

    const [result] = await db.query(sql, [
        user.name,
        user.email,
        user.password,
        user.role
    ]);

    return result;
};

module.exports = {
    findUserByEmail,
    createUser
};