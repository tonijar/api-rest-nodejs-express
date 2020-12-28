const config = require('config');
const express = require("express");
const glob = require("glob");
const log = require('./logger').logger;
const handleErrors = require('./errors').handleErrors;

module.exports = (app) => {
    // ARCH: static content middleware
    app.use(config.get('static-route'), express.static(config.get('static-folder')));

    // ARCH: request interceptor middleware
    app.use(function (req, res, next) {
        log.info("intercept request: " + req.path);
        next();
    });

    // ARCH: response interceptor middleware
    app.use((req, res, next) => {
        let oldSend = res.send;
        res.send = function (data) {
            log.info("intercept response: " + req.path);
            res.send = oldSend; // set function back to avoid the 'double-send'
            return res.send(data); // just call as normal with data
        }
        next();
    });

    // ARCH: include all routes dynamically
    var files = glob.sync(`${__dirname}/../routes/**/*-routes.js`);
    files.forEach((file) => require(file)(app));

    // ARCH: default 404 response middleware
    app.use(function (req, res, next) {
        response = {
            error: true,
            code: 404,
            message: 'URL not found'
        };
        log.info("route not found: " + req.path);
        res.status(404).send(response);
        next();
    });

    // ARCH: error middleware
    app.use(handleErrors);
};
