const express = require("express");
const rotationController = require("../controllers/rotationController");
const router = express.Router();

router
    .route("/get/reportcount/:stdID")
    .get(rotationController.requiredReportCountsOfRotation)

module.exports = router;