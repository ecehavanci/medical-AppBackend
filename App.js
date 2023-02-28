const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const AppError = require("./utils/appError");
const errorHandler = require("./utils/errorHandler");
var connect = require('connect');
const app = express();
const api = "/";
var bodyParser = require('body-parser');


// console.log(routes);
// app.all("*", (req, res, next) => {
//  next(new AppError(`The URL ${req.originalUrl} does not exists`, 404));
// });

app.use(errorHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(api, routes);
app.get("/", (req, res) => {
    res.send("working");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

module.exports = app;
