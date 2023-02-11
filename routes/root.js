const express = require("express");
const stdController = require("../controllers/stdController");
const router = express.Router();

//temp functions----
router.route("/login").get(stdController.getAllStudents).post(stdController.insertStd);

router
    .route("/student:id")
    .get(stdController.filterStdByID)
    .put(stdController.updateStdByID)
    .delete(stdController.deleteStdByID);

module.exports = router;