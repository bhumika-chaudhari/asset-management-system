const bcrypt = require("bcrypt");
const User = require("../models/userModel");

// Register User
const register = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
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

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            userId: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = {
    register
};