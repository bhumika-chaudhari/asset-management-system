const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// All user routes require authentication and Admin role
router.use(authenticate, authorize("Admin"));

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
