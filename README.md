# hapi-ember-fastboot

Ember FastBoot handler for hapi.js

For more information about FastBoot, see [www.ember-fastboot.com](https://www.ember-fastboot.com/), the underlaying library used for rendering the Ember application to static HTML.

[![Build Status](https://travis-ci.org/webstronauts/hapi-ember-fastboot.svg?branch=master)](https://travis-ci.org/webstronauts/hapi-ember-fastboot)

## Usage

```js
const Hapi = require('hapi');
const Fastboot = require('hapi-ember-fastboot');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.register(Fastboot, () => {});

server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        fastboot: {
            distPath: 'path/to/your/ember/app',
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
});
```

## Options

The fastboot handler object has the following properties:

* `distPath` absolute path to your distributed Ember application directory.
* `errorHandler` an optional error handler to handle any errors thrown by the FastBoot instance. If none given, the handler throws a 500 error by default.

## License

MIT, see LICENSE
