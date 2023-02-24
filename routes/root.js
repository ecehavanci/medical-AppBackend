const express = require("express");
const rootController = require("../controllers/rootController");
const router = express.Router();

//temp functions----
router.route("/login/:phoneOrID").get(rootController.login)
// .post(stdController.insertStd);

// router
//     .route("/student:id")
//     .get(stdController.filterStdByID)
//     .put(stdController.updateStdByID)
//     .delete(stdController.deleteStdByID);

module.exports = router;