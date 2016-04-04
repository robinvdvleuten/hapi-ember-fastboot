'use strict';

const Boom = require('boom');
const FastBootServer = require('ember-fastboot-server');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.schema = Joi.object({
    distPath: Joi.string().required(),
    errorHandler: Joi.func()
});

exports.register = function (server, options, next) {

    server.handler('fastboot', internals.handler);

    next();
};

exports.register.attributes = {
    pkg: require('../package.json'),
    connections: false,
    once: true
};

internals.handler = function (route, options) {

    const settings = Joi.attempt(options, internals.schema, `Invalid fastboot handler options (${route.path})`);
    Hoek.assert(route.path[route.path.length - 1] === '}', `The route path must end with a parameter: ${route.path}`);

    const fastboot = new FastBootServer({
        distPath: settings.distPath
    });

    return function (request, reply) {

        fastboot.app.visit(request.path, { request: { get: Hoek.ignore }, response: {} })
            .then((res) => {

                reply(fastboot.insertIntoIndexHTML(res.title, res.body, res.head));
            })
            .catch((err) => {

                if (settings.errorHandler) {
                    return settings.errorHandler(err, request, reply);
                }

                reply(Boom.badImplementation());
            });
    };
};
