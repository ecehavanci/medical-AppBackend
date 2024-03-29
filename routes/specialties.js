const express = require("express");
const specialtyController = require("../controllers/specialtyController");

const router = express.Router();

router
    .route("/all")
    .get(specialtyController.getAllSpecialties);

router
    .route("/getCourseSpecialties/:studentID")
    .get(specialtyController.getCourseSpecialties);

router
    .route("/filter/:specialtyNo")
    .get(specialtyController.getSpecialtyName);

router
    .route("/filter/course/:courseID")
    .get(specialtyController.getCourseSpecialtiesByCourseID);

module.exports = router;