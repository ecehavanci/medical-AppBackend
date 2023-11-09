const express = require("express");
const hospitalController = require("../controllers/hospitalController");
const router = express.Router();

router
    .route("/all")
    .get(hospitalController.getAllHospitals);

module.exports = router;