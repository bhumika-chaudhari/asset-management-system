const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const { logAction } = require("../utils/auditLogger");

// ===============================
// Get All Users
// ===============================
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.getAllUsers();

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// ===============================
// Create User (Admin Only)
// ===============================
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields."
        });
    }

    // Check if email already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser.length > 0) {
        return res.status(409).json({
            success: false,
            message: "Email already exists"
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await User.createUser({
        name,
        email,
        password: hashedPassword,
        role: role || "Employee"
    });

    // Log Action
    await logAction({
        action: "CREATE",
        entity: "User",
        entity_id: result.insertId,
        description: `Created new user: ${email} with role ${role || "Employee"}`,
        user_id: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        userId: result.insertId
    });
});

// ===============================
// Delete User (Admin Only)
// ===============================
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Prevent Admin from deleting themselves
    if (parseInt(id) === parseInt(req.user.id)) {
        return res.status(400).json({
            success: false,
            message: "You cannot delete your own admin account."
        });
    }

    const result = await User.deleteUser(id);

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    // Log Action
    await logAction({
        action: "DELETE",
        entity: "User",
        entity_id: id,
        description: `Deleted user ID: ${id}`,
        user_id: req.user.id,
    });

    res.status(200).json({
        success: true,
        message: "User deleted successfully."
    });
});

module.exports = {
    getAllUsers,
    createUser,
    deleteUser
};
