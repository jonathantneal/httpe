# httpe [<img src="https://jonathantneal.github.io/node-logo.svg" alt="" width="90" height="90" align="right">][httpe]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[httpe] is a 1.43 KB zero-dependency [`http`] and [`https`] replacement module
that supports both protocols and multiple ports simultaneously.

```bash
npm install httpe
```

```js
const httpe = require('httpe');

// start an http/https server on ports 80/443
httpe.createServer().listen();
```

It also includes 2 additional server methods for managing requests; `request`
and `removeRequest`.

```js
const httpe = require('httpe');

server = httpe.createServer().listen().request('GET:80 /', (req, res) => {
  res.write('A one-time GET request on port 80 for the homepage');
  res.end();

  server.removeRequest('GET:80 /');
}).request((req, res) => {
  if (!res.finished) {
    // write the method, port, and URL of the request
    res.write(`${req.method}:${req.connection.server.port} ${request.url}`);
    res.end();
  }
}).listen();
```

It also supports initial configuration of the port.

```js
// start an http/https server on port 8080
new Server({ port: 8080 }).listen();
```

[cli-img]: https://img.shields.io/travis/jonathantneal/httpe.svg
[cli-url]: https://travis-ci.org/jonathantneal/httpe
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[npm-img]: https://img.shields.io/npm/v/httpe.svg
[npm-url]: https://www.npmjs.com/package/httpe

[`http`]: https://nodejs.org/api/http.html
[`https`]: https://nodejs.org/api/https.html
[httpe]: https://github.com/jonathantneal/httpe
