const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const procedureFormController = require("../controllers/formControllers/procedureFormController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.++tStd);
router.route("/insert").post(patientFormController.insertPatientForm);

router.route("/update/:localStorageID").put(patientFormController.updatePatientForm);

router
    .route("/get/count/dashboard/required/:rotationID")
    .get(patientFormController.getRequiredCountPatientFormsForDashboard);

router
    .route("/get/count/dashboard/all/:studentID/:rotationID")
    .get(patientFormController.getAllCountPatientFormsForDashboard);

router
    .route("/get/count/dashboard/approved/:studentID/:rotationID")
    .get(patientFormController.getApprovedCountPatientFormsForDashboard);

router
    .route("/get/count/dashboard/rotations/:studentID")
    .get(patientFormController.getRotationCountPatientFormsForDashboard);

router
    .route("/get/all/:studentID")
    .get(patientFormController.getAllPatientForms);

router
    .route("/get/all/:studentID/:isSent")
    .get(patientFormController.getPatientFormsWithStudentID);


router
    .route("/get/all/:studentID/:isSent/:searchInput")
    .get(patientFormController.searchPatientForms);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved")
    .get(patientFormController.searchPatientFormsByAcceptance);

router
    .route("/get/all/:studentID/:searchInput/:isSent/:isApproved1/:isApproved2")
    .get(patientFormController.searchPatientFormsByMultipleAcceptance);

/*router
    .route("/get/all/:studentID")
    .get(patientFormController.getAllPatientFormsWithStudentID);*/

router
    .route("/get/:ID")
    .get(patientFormController.getPatientFormWithID);


router
    .route("/get/count/:studentID")
    .get(patientFormController.getCount);

router
    .route("/get/local_storage_id/:ID")
    .get(patientFormController.getLocalStorageIDofPatientFormWithID);

router
    .route("/get/ID/:studentID/:localStorageID")
    .get(patientFormController.getIDofPatientForm);

//////////// For att physc.

router
    .route("/patientform/attphysc/all/listBySentDate/:attphyscID/:searchInput/:isApproved")
    .get(patientFormController.listAllPatientReportsAccSentDateForDoc);

///patientform/attphysc/all/listByApproveDate/?attphyscID=:attphyscID/?searchInput=:searchInput/isApproved=:isApproved try?
router
    .route("/patientform/attphysc/all/listByApproveDate/:attphyscID/:searchInput/:isApproved")
    .get(patientFormController.listAllPatientReportsAccApproveDateForDoc);

router
    .route("/delete/:ID")
    .delete(patientFormController.deletePatientFormWithID);

module.exports = router;