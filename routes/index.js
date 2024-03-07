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
    if (req.path === '/api/root/login' || req.path === '/api/' || req.path === '/api/hostwebsite/submit-form' ||
        (req.path === "/api/student/all" && req.method === 'GET') ||
        (req.path === "/api/attendingphysician/all" && req.method === 'GET')) {
        next(); // Pass through without token verification
    } else {
        verifyToken(req, res, next); // Verify token for other routes
    }
});

router.use("/api/root", rootRoutes);
router.use("/api/student", stdRoutes);
router.use("/api/patientForm", patientFormRoutes);
router.use("/api/procedureForm", procedureFormRoutes);
router.use("/api/attendingphysician", physicianRoutes);
router.use("/api/differentialdiagnoses", differentialdiagnoses);
router.use("/api/specialties", specialties);
router.use("/api/courses", course);
router.use("/api/rotations", rotations);
router.use("/api/procedure", procedureRoutes);
router.use("/api/logs", logRouter);
router.use("/api/hospitals", hospitalRouter);
router.use("/api/hostwebsite", hostwebsiteRouter);
module.exports = router;

/*Get Route: to get all the todos in our database.
Post Route: to add a new todo to our database
Get Route: to get a todo by its id
Put Route: to update a todo by the id
Delete Route: to delete a todo by the id. */