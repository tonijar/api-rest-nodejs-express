const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require("helmet");
const partialResponse = require('express-partial-response');
const config = require('config');
const express = require("express");
const app = express();
const log = require('./src/arch/logger').logger;

// ARCH: add support middleware for partial responses
app.use(partialResponse());

// ARCH: add some security headers middleware
app.use(helmet());

// ARCH: compress all responses middleware
app.use(compression());

// ARCH: add JSON parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ARCH: add all common middleware and available routes
require('./src/arch/routes')(app);

let server = app.listen(config.get('port'), () => {
    log.info("Server initialized at port " + server.address().port);
});

module.exports = app;
