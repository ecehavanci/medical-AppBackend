const express = require("express");
const logController = require("../controllers/logController");

const router = express.Router();

router
    .route("/patientCounter/:formID")
    .get(logController.countPatientLogs);
router
    .route("/procedureCounter/:formID")
    .get(logController.countProcedureLogs);

router
    .route("/patientDifference/:formID")
    .get(logController.readPatientDifferences);

router
    .route("/procedureDifference/:formID")
    .get(logController.readProcedureDifferences);

module.exports = router;