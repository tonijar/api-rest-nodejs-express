const config = require('config');
const bunyan = require('bunyan');
const express = require("express");
const glob = require("glob");
const log = require('./arch/logger').logger;

module.exports = (app) => {
    // ARCH: static content
    app.use(config.get('static-route'), express.static(config.get('static-folder')));

    // ARCH: request interceptor
    app.use(function (req, res, next) {
        log.info("intercept request: " + req.path);
        next();
    });

    // ARCH: response interceptor
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
    var files = glob.sync(`${__dirname}/routes/**/*-routes.js`);
    files.forEach((file) => require(file)(app));

    // ARCH: default 404 response interceptor
    app.use(function (req, res, next) {
        response = {
            error: true,
            code: 404,
            message: 'URL not found'
        };
        res.status(404).send(response);
        next();
    });

    // ARCH: error handling
    app.use(function (err, req, res, next) {
        log.error("error handler: " + err.stack);
        res.status(500).send('Something broke!');
    });
};
