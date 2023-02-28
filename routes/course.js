const express = require("express");
const courseController = require("../controllers/courseController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/get/all")
    .get(courseController.getAllCourses)

router
    .route("/get/:ID")
    .get(courseController.filterCourseByID)

// router.route("/:ID/:colName/:value")
//     .put(physicianController.updatePhysicianByID) //!!!need to think a bit

module.exports = router;