const express = require("express");
const hostwebsiteController = require("../controllers/hostwebsiteController");

const router = express.Router();

router
    .route("/submit-form")
    .post(hostwebsiteController.submitForm);

module.exports = router;