const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
var connect = require('connect');
const app = express();
const api = "/";
var bodyParser = require('body-parser');
const killPort = require('kill-port');

app.use(errorHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(api, routes);
app.use(api, helmet());

app.get("/", (req, res) => {
    res.send("working");
});

const PORT = 443;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

module.exports = app;
