# hapi-ember-fastboot

Ember Fastboot handler for hapi.js

## Example

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
