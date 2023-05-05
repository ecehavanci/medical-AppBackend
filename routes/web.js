const express = require("express");
const webController = require("../controllers/webController");

const router = express.Router();

router
    .route("/get/courses")
    .get(webController.getAllCourses)

router
    .route("/post/courses")
    .post(webController.insertCourse)

router
    .route("/get/coordinators")
    .get(courseController.getCoordinators)

router
    .route("/post/coordinators")
    .post(webController.insertCoordinators)

router
    .route("/get/diagnostics")
    .get(courseController.getDiagnostics)

router
    .route("/post/diagnostics")
    .post(webController.insertDiagnostics)

router
    .route("/get/attendingphysicians")
    .get(courseController.getAttPhysc)

router
    .route("/post/attendingphysicians")
    .post(webController.insertAttPhysc)

router
    .route("/post/attendingphysicians")
    .put(webController.updateAttPhysc)


module.exports = router;