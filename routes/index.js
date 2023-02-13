const express = require("express");
const rootRoutes = require("./root");
const stdRoutes = require("./student");
const router = express.Router();


router.use("/root",rootRoutes);
router.use("/student",stdRoutes);
// router.route("student").get(controllers.getAllStudents)
// // .post(controllers.insertStd);

// router
//     .route("/student:id")
//     .get(controllers.filterStdByID)
//     .put(controllers.updateStdByID)
//     .delete(controllers.deleteStdByID);

module.exports = router;

/*Get Route: to get all the todos in our database.
Post Route: to add a new todo to our database
Get Route: to get a todo by its id
Put Route: to update a todo by the id
Delete Route: to delete a todo by the id. */