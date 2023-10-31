const express = require("express");
const physicianController = require("../controllers/physicianController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/all")
    .get(physicianController.getAllPhysicians)
    .post(physicianController.insertPhysician);

router
    .route("/:ID")
    .get(physicianController.filterPhysician)
    .put(physicianController.updateAttendingPhysician)
    .delete(physicianController.deletePhysicianByID);

module.exports = router;