var userDomain = require('../domain/user');
let user = userDomain.user;
let response = userDomain.response;

module.exports = (app) => {
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
}