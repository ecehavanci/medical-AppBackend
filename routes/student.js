const express = require("express");
const stdController = require("../controllers/stdController");
const router = express.Router();

router.route("/").get(stdController.getAllStudents)
// .post(stdController.insertStd);

router
    .route("/:id")
    .get(stdController.filterStdByID)
    .put(stdController.updateStdByID)
    .delete(stdController.deleteStdByID);

module.exports = router;