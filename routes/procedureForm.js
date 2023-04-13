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
    .route("/get/all/by/sendDate/:attendingPhysicianID/:searchInput/:isApproved")
    .get(procedureFormController.searchSentProcedureFormsWithDocIDAccordingToSendDate);

router
    .route("/get/all/by/approveDate/:attendingPhysicianID/:searchInput/:isApproved")
    .get(procedureFormController.searchSentProcedureFormsWithDocIDAccordingToApproveDate);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved")
    .get(procedureFormController.searchProcedureReportsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2")
    .get(procedureFormController.searchProcedureReportsByMultipleAcceptance);


router
    .route("/get/count/:studentID")
    .get(procedureFormController.getCount);

router
    .route("/get/:ID")
    .get(procedureFormController.getProcedureFormWithID);

router
    .route("/get/local_storage_id/:ID")
    .get(procedureFormController.getLocalStorageIDofProcedureFormWithID);

router
    .route("/get/ID/:studentID/:localStorageID")
    .get(procedureFormController.getIDofProcedureForm);

router
    .route("/delete/:ID")
    .delete(procedureFormController.deleteProcedureFormWithID);

router
    .route("/update/:updateChoice/:approveDate/:approveTime/:reportID")
    .put(procedureFormController.updateProcedureFormApproveInfo);


module.exports = router;