const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require("helmet");
const partialResponse = require('express-partial-response');
const bunyan = require('bunyan');
const config = require('config');
const express = require("express");
const app = express();
const log = require('./src/arch/logger').logger;

// ARCH: add support for partial responses
app.use(partialResponse());

// ARCH: add some security headers
app.use(helmet());

// ARCH: compress all responses
app.use(compression());

// ARCH: add JSON parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./src/routes')(app);

let server = app.listen(config.get('port'), () => {
    log.info("Server initialized at port " + server.address().port);
});

module.exports = app;
