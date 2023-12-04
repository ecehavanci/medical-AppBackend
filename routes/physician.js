const express = require("express");
const physicianController = require("../controllers/physicianController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/all")
    .get(physicianController.getAllPhysicians)
    .post(physicianController.insertPhysician);

router
    .route("/coursePhysicians/:stdID")
    .get(physicianController.listCoursePhysicians)

router
    .route("/fullInfo/:ID")
    .get(physicianController.getFullPhysicianInfoByID)

router
    .route("/:ID")
    .get(physicianController.filterPhysician)
    .put(physicianController.updateAttendingPhysician)
    .delete(physicianController.deletePhysicianByID);

router
    .route("/matchStdRotations/:physicianId/rotation/:rotationNumber/course/:courseId/students")
    .get(physicianController.matchPhysiciandStdWithRotation)

module.exports = router;