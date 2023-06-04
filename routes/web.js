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
    .get(webController.getCoordinators)

router
    .route("/post/coordinators")
    .post(webController.insertCoordinators)

router
    .route("/get/diagnostics")
    .get(webController.getDiagnostics)

router
    .route("/post/diagnostics")
    .post(webController.insertDiagnostics)

router
    .route("/get/attendingphysicians")
    .get(webController.getAttPhysc)

router
    .route("/post/attendingphysicians")
    .post(webController.insertAttPhysc)

router
    .route("/post/attendingphysicians")
    .put(webController.updateAttPhysc)

router
    .route("/get/specialties")
    .get(webController.getSpecialties)
router
    .route("/post/specialties")
    .post(webController.insertSpecialties)


module.exports = router;