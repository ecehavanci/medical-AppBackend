// procedureRoutes.js

const express = require("express");
const procedureController = require("../controllers/procedureController");
const router = express.Router();

router
    .route("/approved")
    .get(procedureController.getApprovedProcedures);

router
    .route("/get/:procedureID")
    .get(procedureController.getProceduresByID)
    .put(procedureController.updateProcedure);
    
router
    .route("/get/:relatedReport")
    .get(procedureController.getProcedureByRelatedReportID);

router.route("/insert")
    .post(procedureController.insertProcedure);

module.exports = router;
