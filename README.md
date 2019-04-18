# httpe [<img src="https://jonathantneal.github.io/node-logo.svg" alt="" width="90" height="90" align="right">][httpe]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[httpe] is a 1.46 KB zero-dependency [`http`] and [`https`] replacement module
that supports both protocols and multiple ports simultaneously.

```bash
npm install httpe
```

```js
const httpe = require('httpe');

// start an http/https server on ports 80/443
httpe.createServer().listen();
```

It also includes 2 additional server methods for managing requests — `request`
and `removeRequest` — which support listening to specific methods, ports, or
glob paths.

```js
const httpe = require('httpe');

server = httpe.createServer().listen().request('GET:80 /', (req, res) => {
  // Homepage: show a custom message once
  res.write('A one-time GET request on port 80 for the root of the site');
  res.end();

  server.removeRequest('GET:80 /');
}).request('/**.js', (req, res) => {
  // JavaScript: show a confusing message
  if (!res.finished) {
    res.write(`eval does a body good`);
    res.end();
  }
}.request((req, res) => {
  if (!res.finished) {
    // Anything Else: show the method, port, and URL of the request
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

### request

The `request` function attaches a request listener so that whenever a **path**
is matched a **callback** is run.

The path may contain a **method**, **port**, and **pathname** with globs.

**Examples**

```js
// runs whenever the root is requested on port 80 using the GET method
server.request('GET:80 /', (res, req) => {});

// runs whenever the root is requested on port 80 using any method
server.request(':80 /', (res, req) => {});

// runs whenever the root is requested on any port using any method
server.request('/', (res, req) => {});

// runs whenever the root is requested on any port using the GET method
server.request('GET /', (res, req) => {});

// runs whenever any path is requested on any port using the GET method
server.request('GET', (res, req) => {});

// runs whenever any path is requested on port 80 using any method
server.request(':80', (res, req) => {});

// runs whenever any path ending in .js is requested on any port using any method
server.request('/**.js', (res, req) => {});

// runs whenever a subdir path of any depth is requested on any port using any method
server.request('/**/*', (res, req) => {});
```

### removeRequest

The `removeRequest` function detaches a request listener so that whenever a
**path** is matched a **callback** is no longer run.

The path may contain a **method**, **port**, and **pathname** with globs.

**Examples**

```js
// removes requests for the root on port 80 using the GET method
server.removeRequest('GET:80 /', (res, req) => {});

// removes requests for the root on port 80 using any method
server.request(':80 /', (res, req) => {});

// removes requests for the root on any port using any method
server.request('/', (res, req) => {});

// removes requests for the root on any port using the GET method
server.request('GET /', (res, req) => {});

// removes requests for any path on any port using the GET method
server.request('GET', (res, req) => {});

// removes requests for any path on port 80 using any method
server.request(':80', (res, req) => {});

// removes requests for any path ending in .js on any port using any method
server.request('/**.js', (res, req) => {});

// removes requests for any subdir path of any depth on any port using any method
server.request('/**/*', (res, req) => {});
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
