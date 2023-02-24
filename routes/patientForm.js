const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const procedureFormController = require("../controllers/formControllers/procedureFormController");
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


router
    .route("/get/count")
    .get(patientFormController.getCount);

router
    .route("/get/local_storage_id/:ID")
    .get(patientFormController.getLocalStorageIDofPatientFormWithID);

router
    .route("/get/ID/:studentID/:localStorageID")
    .get(patientFormController.getIDofPatientForm);

router
    .route("/delete/:ID")
    .delete(patientFormController.deletePatientFormWithID);

module.exports = router;