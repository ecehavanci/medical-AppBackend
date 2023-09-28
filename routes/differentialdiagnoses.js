const express = require("express");
const differentialdiagnosesController = require("../controllers/differentialdiagnosesController");
// const ee = require("../controllers/physicianController");

const router = express.Router();

router
    .route("/approved")
    .get(differentialdiagnosesController.getApprovedDiffDiagnoses)
router
    .route("/:diagnoseID")
    .get(differentialdiagnosesController.getDiffDiagnosesByDiagnoseID);

router.route("/insert")
    .post(differentialdiagnosesController.insert);

// .post(physicianController.insertPhyscian);

// .delete(physicianController.deletePhysicianByID);

// router.route("/:ID/:colName/:value")
//     .put(physicianController.updatePhysicianByID) //!!!need to think a bit

module.exports = router;