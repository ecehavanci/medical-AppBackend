const express = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = express.Router();

router
    .route("/all/:studentID")
    .get(specialtyController.getSpecialtiesOfCurrentRotation);

router
    .route("/previous/all/:studentID")
    .get(specialtyController.getSpecialtiesOfPreviousRotation);

module.exports = router;