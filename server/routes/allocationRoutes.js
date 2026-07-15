const express = require("express");

const router = express.Router();

const allocationController = require("../controllers/allocationController");

const {
    authenticate,
    authorize
} = require("../middleware/authMiddleware");

router.get(
    "/",
    authenticate,
    allocationController.getAllocations
);

router.post(
    "/",
    authenticate,
    authorize("Admin"),
    allocationController.allocateAsset
);



router.put(
    "/:id/return",
    authenticate,
    authorize("Admin"),
    allocationController.returnAsset
);


module.exports = router;