const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.insertStd);
router.route("/insert").put(patientFormController.insertPatientForm);

router
    .route("/get/all")
    .get(patientFormController.getAllPatientForms);

router
    .route("/get/:ID")
    .get(patientFormController.getPatientFormWithID);

router
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
        "/tr/:traineesRole?" +
        "/loc/:levelOfCare?" +
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
    .put(patientFormController.updatePatientFormWithID)

router
    .route("/delete/:ID")
    .delete(patientFormController.deletePatientFormWithID);

module.exports = router;