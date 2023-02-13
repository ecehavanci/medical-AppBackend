const express = require("express");
const stdController = require("../controllers/stdController");
const router = express.Router();

//router.route('/all').get(stdController.getAllStudents).post(stdController.insertStd);
router
    .route("/all")
    .get(stdController.getAllStudents);

router
    .route("/:ID")
    .get(stdController.filterStdByID) 
    .put(stdController.updateStdByID) //!!!need to think a bit
    .delete(stdController.deleteStdByID);



module.exports = router;