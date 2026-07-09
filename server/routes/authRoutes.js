const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const {
    registerValidation,
    validate
} = require("../validators/authValidator");

router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

router.post(
    "/login",
    authController.login
);

module.exports = router;