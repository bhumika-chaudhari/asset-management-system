const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {

        // Read Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Expected format:
        // Authorization: Bearer <token>
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format."
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach user to request
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }
};
const authorize = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission."
            });

        }

        next();
    };
};
module.exports = {
    authenticate,
    authorize
};