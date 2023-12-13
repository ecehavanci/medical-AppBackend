const express = require("express");
const rootController = require("../controllers/rootController");
const router = express.Router();

router.route("/login").post(rootController.login)

module.exports = router;