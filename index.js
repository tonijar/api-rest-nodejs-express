const express = require("express");
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require("helmet");
const partialResponse = require('express-partial-response');
const bunyan = require('bunyan');
const config = require('config');
const app = express();

let user = {
    name: '',
    surname: ''
};

let response = {
    error: false,
    code: 200,
    message: ''
};

// ARCH: logger
function reqSerializer(req) {
    return {
        method: req.method,
        url: req.url,
        headers: req.headers
    }
}
const log = bunyan.createLogger({ name: config.get('app-name'), serializers: { req: reqSerializer } });

// ARCH: add support for partial responses
app.use(partialResponse());

// ARCH: add some security headers
app.use(helmet());

// ARCH: compress all responses
app.use(compression());

// ARCH: add JSON parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ARCH: static content
app.use('/static', express.static('public'));

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

// ARCH: error handling
app.use(function (err, req, res, next) {
    log.error("error handler: " + err.stack);
    res.status(500).send('Something broke!');
});

app.route('/user')
    .get(function (req, res) {
        response = {
            error: false,
            code: 200,
            message: ''
        };
        if (user.name === '' || user.surname === '') {
            response = {
                error: true,
                code: 501,
                message: 'User not created'
            };
        } else {
            response = {
                error: false,
                code: 200,
                message: 'User response',
                response: user
            };
        }
        res.send(response);
    })
    .post(function (req, res) {
        if (!req.body.name || !req.body.surname) {
            response = {
                error: true,
                code: 502,
                message: 'Name and surname fields required'
            };
        } else {
            if (user.name !== '' || user.surname !== '') {
                response = {
                    error: true,
                    code: 503,
                    message: 'User already created previously'
                };
            } else {
                user = {
                    name: req.body.name,
                    surname: req.body.surname
                };
                response = {
                    error: false,
                    code: 200,
                    message: 'User created',
                    response: user
                };
            }
        }

        res.send(response);
    })
    .put(function (req, res) {
        if (!req.body.name || !req.body.surname) {
            response = {
                error: true,
                code: 502,
                message: 'Name and surname fields required'
            };
        } else {
            if (user.name === '' || user.surname === '') {
                response = {
                    error: true,
                    code: 501,
                    message: 'User not created'
                };
            } else {
                user = {
                    name: req.body.name,
                    surname: req.body.surname
                };
                response = {
                    error: false,
                    code: 200,
                    message: 'User updated',
                    response: user
                };
            }
        }

        res.send(response);
    })
    .delete(function (req, res) {
        if (user.name === '' || user.surname === '') {
            response = {
                error: true,
                code: 501,
                message: 'User not created'
            };
        } else {
            response = {
                error: false,
                code: 200,
                message: 'User deleted'
            };
            user = {
                name: '',
                surname: ''
            };
        }
        res.send(response);
    });

app.use(function (req, res, next) {
    response = {
        error: true,
        code: 404,
        message: 'URL not found'
    };
    res.status(404).send(response);
});

let server = app.listen(config.get('port'), () => {
    log.info("Server initialized at port " + server.address().port);
});

module.exports = server;
