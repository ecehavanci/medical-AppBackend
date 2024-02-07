const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const router = express.Router();

router.route("/insert")
    .post(patientFormController.insertPatientForm);

router.route("/update/:ID")
    .put(patientFormController.updatePatientForm);

router
    .route("/get/count/dashboard/approved/:studentID/:courseID")
    .get(patientFormController.getCountPatientFormsForDashboardAccordingToApproval);

router
    .route("/get/doctor/count/dashboard/approved/:studentID/:rotationID/:courseID/:physicianID")
    .get(patientFormController.getDoctorCountPatientFormsForDashboardAccordingToApproval);

router
    .route("/get/doctor/count/linear-chart/:rotationID/:courseID/:physicianID")
    .get(patientFormController.getLinearTotalProgressBarData);

router
    .route("/get/all/:studentID/:isSent")
    .get(patientFormController.listSent5ReportForStudent);

router
    .route("/get/all/by/approveDate/:attendingPhysicianID/:searchInput/:isApproved/:rotationID/:courseID/:specialtyID")
    .get(patientFormController.searchSentPatientFormsWithDocIDAccordingToApproveDate);

router
    .route("/get/all/by/sendDate/:physicianID")
    .get(patientFormController.listWaitingReports);

router
    .route("/get/all/:studentID/:isSent/:searchInput/:courseID")
    .get(patientFormController.searchPatientFormsForStudent);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved/:courseID")
    .get(patientFormController.searchPatientFormsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2/:courseID")
    .get(patientFormController.searchPatientFormsByMultipleAcceptance);

router
    .route("/get/ID/:studentID/:localStorageID")
    .get(patientFormController.getIDofPatientForm);

router
    .route("/get/lastLocalID/:studentID")
    .get(patientFormController.getLastLocalStorageID);

router
    .route("/get/draftIsSent/:studentID/:localStorageID")
    .get(patientFormController.checkDraftIsSent);

router
    .route("/get/checkSaveEpoch/:studentID/:localStorageID")
    .get(patientFormController.checkSaveEpoch);

router
    .route("/get/draftReportToUpdateLocal/:studentID/:localStorageID")
    .get(patientFormController.draftReportToUpdateLocal);

router
    .route("/delete/:stdID/:localStorageID")
    .delete(patientFormController.deletePatientFormWithID);

module.exports = router;