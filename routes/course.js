const express = require("express");
const courseController = require("../controllers/courseController");

const router = express.Router();

router
    .route("/all")
    .get(courseController.getAllCourses)

router
    .route("/get/:ID")
    .get(courseController.filterCourseByID)

router
    .route("/get/:stdID")
    .get(courseController.getCourseName)
router
    .route("/get/semesterInfo/:stdID")
    .get(courseController.listStudentSemesterInfos)

router
    .route("/get/all/psy/:physicianID")
    .get(courseController.listPhysicianSemesterCourses)

router
    .route("/requiredReportCountsOfCourse/:stdID")
    .get(courseController.requiredReportCountsOfCourse)

module.exports = router;""