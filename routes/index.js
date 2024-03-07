const express = require("express");
const rootRoutes = require("./root");
const stdRoutes = require("./student");
const patientFormRoutes = require("./patientForm");
const procedureFormRoutes = require("./procedureForm");
const physicianRoutes = require("./physician");
const differentialdiagnoses = require("./differentialdiagnoses");
const specialties = require("./specialties");
const course = require("./course");
const rotations = require("./rotations");
const web = require("./web");
const procedureRoutes = require("./procedure");
const logRouter = require("./log");
const hospitalRouter = require("./hospital");
const hostwebsiteRouter = require("./hostwebsiteRouter");
const verifyToken = require('../utils/verifyToken');
const router = express();


router.use((req, res, next) => {
    // Middleware to exclude certain routes from token verification
    if (req.path === '/root/login' || req.path === '/' || req.path === '/hostwebsite/submit-form' ||
        (req.path === "/student/all" && req.method === 'GET') ||
        (req.path === "/attendingphysician/all" && req.method === 'GET')) {
        next(); // Pass through without token verification
    } else {
        verifyToken(req, res, next); // Verify token for other routes
    }
});

router.use("/root", rootRoutes);
router.use("/student", stdRoutes);
router.use("/patientForm", patientFormRoutes); //
router.use("/procedureForm", procedureFormRoutes); //
router.use("/attendingphysician", physicianRoutes);
router.use("/differentialdiagnoses", differentialdiagnoses);
router.use("/specialties", specialties);
router.use("/courses", course);
router.use("/rotations", rotations);
router.use("/procedure", procedureRoutes);
router.use("/logs", logRouter);
router.use("/hospitals", hospitalRouter);
router.use("/hostwebsite", hostwebsiteRouter);

module.exports = router;

/*Get Route: to get all the todos in our database.
Post Route: to add a new todo to our database
Get Route: to get a todo by its id
Put Route: to update a todo by the id
Delete Route: to delete a todo by the id. */