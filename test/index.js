'use strict';

const Boom = require('boom');
const Code = require('code');
const Fastboot = require('../lib');
const Hapi = require('hapi');
const Hoek = require('hoek');
const Lab = require('lab');
const Path = require('path');

// Declare internals

const internals = {};

internals.distPath = Path.join(__dirname, '..', 'node_modules/ember-fastboot-server/test/fixtures/basic-app');

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('Fastboot', () => {

    describe('handler()', () => {

        it('handles routes to Fastboot', (done) => {

            const server = new Hapi.Server();
            server.connection();
            server.register(Fastboot, Hoek.ignore);

            server.route({ method: 'GET', path: '/{path*}', handler: { fastboot: { distPath: internals.distPath } } });

            server.inject({
                method: 'GET',
                url: '/'
            }, (res) => {

                expect(res.result).to.contain('Welcome to Ember');
                done();
            });
        });

        it('handles Fastboot\'s errors', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Fastboot, Hoek.ignore);

            server.route({ method: 'GET', path: '/{path*}', handler: { fastboot: { distPath: internals.distPath } } });

            server.inject({
                method: 'GET',
                url: '/unknown'
            }, (res) => {

                expect(res.statusCode).to.equal(500);
                done();
            });
        });

        it('handles Fastboot\'s errors with custom error handler', (done) => {

            const server = new Hapi.Server({ debug: false });
            server.connection();
            server.register(Fastboot, Hoek.ignore);

            const errorHandler = function (err, request, reply) {

                expect(err).not.to.be.an.instanceof(Error);
                expect(err.name).to.equal('UnrecognizedURLError');

                reply(Boom.badImplementation());
            };

            server.route({ method: 'GET', path: '/{path*}', handler: { fastboot: { distPath: internals.distPath, errorHandler } } });

            server.inject({
                method: 'GET',
                url: '/unknown'
            }, (res) => {

                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });
});
