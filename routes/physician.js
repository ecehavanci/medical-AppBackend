const express = require("express");
const physicianController = require("../controllers/physicianController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/all")
    .get(physicianController.getAllPhysicians).post(physicianController.insertPhyscian);

router
    .route("/:ID")
    .get(physicianController.filterPhysicianByID)
    .delete(physicianController.deletePhysicianByID);

router.route("/:ID/:colName/:value")
    .put(physicianController.updatePhysicianByID) //!!!need to think a bit

module.exports = router;