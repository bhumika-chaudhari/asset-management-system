const db = require("../config/db");

// Find user by email
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows;
};

// Find user by ID
const findUserById = async (id) => {
    const [rows] = await db.query(
        "SELECT id, name, email, role FROM users WHERE id = ?",
        [id]
    );

    return rows;
};

// Create new user
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

// Get all users
const getAllUsers = async () => {
    const [rows] = await db.query(
        "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
    );
    return rows;
};

// Delete user
const deleteUser = async (id) => {
    const [result] = await db.query(
        "DELETE FROM users WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    getAllUsers,
    deleteUser
};