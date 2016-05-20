'use strict';

const Boom = require('boom');
const FastBoot = require('fastboot');
const Hoek = require('hoek');
const Joi = require('joi');

const internals = {};

internals.schema = Joi.object({
    distPath: Joi.string().required(),
    errorHandler: Joi.func(),
    logHandler: Joi.func()
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

    const fastboot = new FastBoot({
        distPath: settings.distPath,
        ui: { writeLine: settings.logHandler }
    });

    return function (request, reply) {

        fastboot.visit(request.path, { request: request.raw.req, response: request.raw.res })
            .then((result) => {

                return result.html()
                    .then((html) => {

                        const response = reply(html).hold();
                        response.code(result.statusCode);

                        for (let pair of result.headers.entries()) {
                            response.header(pair[0], pair[1]);
                        }

                        response.send();
                    });
            })
            .catch((err) => {

                if (settings.errorHandler) {
                    return settings.errorHandler(err, request, reply);
                }

                reply(Boom.badImplementation());
            });
    };
};
