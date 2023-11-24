const express = require("express");
const hospitalController = require("../controllers/hospitalController");
const router = express.Router();

router
    .route("/all")
    .get(hospitalController.getAllHospitals);
router
    .route("/:hospitalID")
    .get(hospitalController.getHospitalByID);

module.exports = router;