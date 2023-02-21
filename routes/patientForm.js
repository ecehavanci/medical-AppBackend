const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.++tStd);
router.route("/insert").post(patientFormController.insertPatientForm);

router.route("/update/:localStorageID").put(patientFormController.updatePatientForm);

router
    .route("/get/all/:studentID")
    .get(patientFormController.getAllPatientForms);

router
    .route("/get/all/:studentID/:isSent")
    .get(patientFormController.getPatientFormsWithStudentID);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved")
    .get(patientFormController.searchPatientReportsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2")
    .get(patientFormController.searchPatientReportsByMultipleAcceptance);

/*router
    .route("/get/all/:studentID")
    .get(patientFormController.getAllPatientFormsWithStudentID);*/

router
    .route("/get/:ID")
    .get(patientFormController.getPatientFormWithID);

/*router
    .route("/update/:ID" +
        "/sID/:studentID?" +
        "/sName/:studentName?" +
        "/rID/:rotationID?" +
        "/sID/:specialtyID?" +
        "/aID/:attendingPhysicianID?" +
        "/dID/:diagnosisID?" +
        "/diagnosis/:diagnosis?" +
        "/phID/:patientHospitalID?" +
        "/pName/:patientName?" +
        "/pAge/:patientAge?" +
        "/r/:relevants?" +
        "/ks/:keySymptoms?" +
        "/s/:signs?" +
        "/d/:data?" +
        "/isO/:isObserved?" +
        "/isA/:isAssisted?" +
        "/isP/:isPerformed?" +
        "/isS/:isSimulated?" +
        "/isH/:isHistory?" +
        "/isT/:isTreatment?" +
        "/isPE/:isPhysicalExamination?" +
        "/isDD/:isDifferentialDiagnosis?" +
        "/setting/:setting?" +
        "/t1ID/:tier1ID?" +
        "/t1/:tier1?" +
        "/t2ID/:tier2ID?" +
        "/t2/:tier2?" +
        "/t3ID/:tier3ID?" +
        "/t3/:tier3?" +
        "/t4D/:tier4D?" +
        "/t4/:tier4?" +
        "/lsd/:lastSaveDate?" +
        "/lst/:lastSaveTime?" +
        "/ad/:approveDate?" +
        "/at/:approveTime?" +
        "/issent/:isSent?" +
        "/isapproved/:isApproved?" +
        "/comment/:comment?" +
        "/lsid/:localStorageID?")
    .put(patientFormController.updatePatientFormWithID)*/

router
    .route("/delete/:ID")
    .delete(patientFormController.deletePatientFormWithID);

module.exports = router;