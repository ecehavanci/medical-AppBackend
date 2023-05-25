const express = require("express");
const stdController = require("../controllers/stdController");
const router = express.Router();

router
    .route("/all")
    .get(stdController.getAllStudents).post(stdController.insertStd);;

router
    .route("/:ID")
    .post(stdController.filterStdByID)
    .delete(stdController.deleteStdByID);

router.route("/:ID/:colName/:value").put(stdController.updateStdByID);

module.exports = router;