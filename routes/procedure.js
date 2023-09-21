const express = require("express");
const procedureController= require("../controllers/procedureController");
const router = express.Router();

router
    .route("/approved")
    .get(procedureController.getApprovedProcedures)
    
router
    .route("/:procedureID")
    .get(procedureController.getProceduresByID) //NOT USING CURRENTLY
    
router
    .route("/:relatedReport")
    .get(procedureController.getProcedureByRelatedReportID)
    .put(procedureController.updateProcedure);


router.route("/insert").post(procedureController.insertProcedure);

module.exports = router;