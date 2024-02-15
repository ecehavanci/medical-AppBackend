const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./utils/errorHandler");
const app = express();
const api = "/";
var bodyParser = require('body-parser');
const http = require('http');
const PORT = 8080;
const path = require('path');

app.use(errorHandler);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(api, routes);
app.use(api, helmet());
app.use(cors({
  origin: 'https://medsis.izmirekonomi.edu.tr',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.disable('x-powered-by');

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

const server = http.createServer(app);

server.keepAliveTimeout = 60000; // 60 saniye

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


module.exports = app;