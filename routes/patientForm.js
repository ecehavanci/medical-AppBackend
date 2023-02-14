const express = require("express");
const patientFormController = require("../controllers/formControllers/patientFormController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.insertStd);
router
    .route("/all")
    .get(patientFormController.getAllPatientForms);

router.route("/insert").put(patientFormController.insertPatientForm)


router
    .route("/:ID")
    .get(patientFormController.getPatientFormWithID)
    .put(patientFormController.updateSPatientFormWithID)
    .delete(patientFormController.deletePatientFormWithID);




module.exports = router;