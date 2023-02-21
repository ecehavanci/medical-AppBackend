const express = require("express");
const procedureFormController = require("../controllers/formControllers/procedureFormController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.++tStd);
router.route("/insert").post(procedureFormController.insertProcedureForm);

router.route("/update/:ID").put(procedureFormController.updateProcedureForm);

router
    .route("/get/all/:studentID")
    .get(procedureFormController.getAllProcedureFormsWithStudentID);

router
    .route("/get/all/:studentID/:isSent")
    .get(procedureFormController.listProcedureFormsWithStudentID);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved")
    .get(procedureFormController.searchProcedureReportsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent")
    .get(procedureFormController.searchProcedureFormsForStudent);

router
    .route("/get/all/sendDate/:studentID/:searchInput/:isSent/:isApproved")
    .get(procedureFormController.searchProcedureFormsForStudentByAcceptance);

router
    .route("/get/all/sendDate/:docID/:searchInput/:isApproved")
    .get(procedureFormController.searchSentProcedureFormsWithDocIDAccordingToSendDate);

router
    .route("/get/allSent/approveDate/:docID/:searchInput/:isApproved")
    .get(procedureFormController.searchSentProcedureFormsWithDocIDAccordingToApproveDate);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved")
    .get(procedureFormController.searchProcedureReportsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2")
    .get(procedureFormController.searchProcedureReportsByMultipleAcceptance);

router
    .route("/get/:ID")
    .get(procedureFormController.getProcedureFormWithID);

router
    .route("/delete/:ID")
    .delete(procedureFormController.deleteProcedureFormWithID);

module.exports = router;