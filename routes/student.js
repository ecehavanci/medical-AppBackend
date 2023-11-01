const express = require("express");
const stdController = require("../controllers/stdController");
const router = express.Router();

router
    .route("/all")
    .get(stdController.getAllStudents).post(stdController.insertStd);;

router
    .route("/:ID")
    .get(stdController.filterStdByID)//do not forget to make it post later
    .delete(stdController.deleteStdByID);

router.route("update/:ID")
    .put(stdController.updateStdByID);

module.exports = router;