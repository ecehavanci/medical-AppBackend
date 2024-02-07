const express = require("express");
const procedureFormController = require("../controllers/formControllers/procedureFormController");
const router = express.Router();

router.route("/insert").post(procedureFormController.insertProcedureForm);

router.route("/update/:ID").put(procedureFormController.updateProcedureForm);

router
    .route("/get/count/dashboard/approved/:studentID/:courseID")
    .get(procedureFormController.getCountProcedureFormsForDashboardAccordingToApproval);

router
    .route("/get/doctor/count/linear-chart/:rotationID/:courseID/:physicianID")
    .get(procedureFormController.getLinearTotalProgressBarData);

router
    .route("/get/doctor/count/dashboard/approved/:studentID/:rotationID/:courseID/:physicianID")
    .get(procedureFormController.getDoctorCountProcedureFormsForDashboardAccordingToApproval);

router
    .route("/get/all/:studentID/:isSent")
    .get(procedureFormController.list5ProcedureFormsWithStudentID);

router
    .route("/get/all/sendDate/:studentID/:searchInput/:isSent/:isApproved/:courseID")
    .get(procedureFormController.searchProcedureFormsForStudentByAcceptance);

router
    .route("/get/all/by/sendDate/:physicianID")
    .get(procedureFormController.listWaitingReports);

router
    .route("/get/all/by/approveDate/:attendingPhysicianID/:searchInput/:isApproved/:rotationID/:courseID/:specialtyID/:procedureID")
    .get(procedureFormController.searchSentProcedureFormsWithDocIDAccordingToApproveDate);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:courseID")
    .get(procedureFormController.searchProcedureFormsForStudent);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved/:courseID")
    .get(procedureFormController.searchProcedureReportsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2/:courseID")
    .get(procedureFormController.searchProcedureReportsByMultipleAcceptance);

router
    .route("/get/ID/:studentID/:localStorageID")
    .get(procedureFormController.getIDofProcedureForm);

router
    .route("/get/lastLocalID/:studentID")
    .get(procedureFormController.getLastLocalStorageID);

router
    .route("/get/draftIsSent/:studentID/:localStorageID")
    .get(procedureFormController.checkDraftIsSent);

router
    .route("/get/checkSaveEpoch/:studentID/:localStorageID")
    .get(procedureFormController.checkSaveEpoch);

router
    .route("/get/draftReportToUpdateLocal/:studentID/:localStorageID")
    .get(procedureFormController.draftReportToUpdateLocal);

router
    .route("/delete/:ID/:localStorageID")
    .delete(procedureFormController.deleteProcedureFormWithID);

module.exports = router;