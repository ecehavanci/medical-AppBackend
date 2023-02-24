const express = require("express");
const diagnosisController = require("../controllers/diagnosisController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/all")
    .get(diagnosisController.getAllDiagnosis)
    // .post(physicianController.insertPhyscian);

router
    .route("/:ID")
    .get(diagnosisController.filterDiagnosisByID)
    // .delete(physicianController.deletePhysicianByID);

// router.route("/:ID/:colName/:value")
//     .put(physicianController.updatePhysicianByID) //!!!need to think a bit

module.exports = router;