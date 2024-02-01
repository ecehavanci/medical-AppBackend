const express = require("express");
const rotationController = require("../controllers/rotationController");
const router = express.Router();

router
    .route("/update/:rotationNo/:stdID")
    .put(rotationController.updateStdRotation)

router
    .route("/update/:stdID")
    .put(rotationController.deleteStdRotation)

module.exports = router;