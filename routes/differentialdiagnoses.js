const express = require("express");
const differentialdiagnosesController = require("../controllers/differentialdiagnosesController");

const router = express.Router();

router
    .route("/approved")
    .get(differentialdiagnosesController.getApprovedDiffDiagnoses)
router
    .route("/:diagnoseID")
    .get(differentialdiagnosesController.getDiffDiagnosesByDiagnoseID)
    .put(differentialdiagnosesController.updateApprovalStatus);

router.route("/insert")
    .post(differentialdiagnosesController.insert);

module.exports = router;