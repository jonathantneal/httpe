# httpe [<img src="https://jonathantneal.github.io/node-logo.svg" alt="" width="90" height="90" align="right">][httpe]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[httpe] is a 1.89 KB zero-dependency [`http`] and [`https`] replacement module
that supports multiple protocols and ports simultaneously. It includes updates
for `request` and `response` functions to match [express] counterparts.

```bash
npm install httpe
```

```js
const httpe = require('httpe');

// start an http/https server on ports 80/443
httpe.createServer().listen().on(
  'request',
  (request, res) => {
    if (request.match('GET:80 /')) {
      // Homepage: show a custom message
      res.send('A request for the root on port 80 using the GET method');
    } else if (request.match('/**.js')) {
      // JavaScript: show a confusing message
      res.send(`eval does a body good`);
    } else {
      // Anything Else: show the method, port, and URL of the request
      res.send(`${request.method}:${request.connection.server.port} ${request.pathname}`);
    }
  }
);
```

It also supports initial configuration of the port.

```js
// start an http/https server on port 8080
httpe.createServer({ port: 8080 }).listen();
```

## httpe.createServer

The `createServer` method returns a new instance of a [`Server`](#httpe.Server).

```js
server = httpe.createServer();
```

Arguments are identical to
[https.createServer](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)
with the addition of `port`, which specifies the port or ports to be used by
the server.

```js
server = httpe.createServer({ port: 8080 });
```

## httpe.Server

The `Server` class creates a server on multiple protocols and ports
simultaneously, and extends 
[`http.Server`](https://nodejs.org/api/http.html#http_class_http_server).

```js
server = new Server();
```

Arguments are identical to
[https.createServer](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)
with the addition of `port`, which specifies the port or ports to be used by
the server.

```js
server = new Server({ port: 8080 });
```

### server.isPortAvailable

The `isPortAvailable` function returns a Promise for whether a port is
available for a connection.

```js
server.isPortAvailable(80).then(isPortAvailable => {});
```

### server.getFirstAvailablePort

The `getFirstAvailablePort` function returns a Promise for the first available
port for a connection. If the port is unavailable, the next port up will
check for an available connection.

```js
server.getFirstAvailablePort(80).then(availablePort => {});
```

---

## request

Each `request` is identical to
[`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
with the addition of properties available to new
[`URL`](https://nodejs.org/api/url.html#url_class_url) instances.

```js
request.pathname; // the pathname does not include search params
```

## request.match

The `match` function returns whether a path matches the current request.

The path may contain a **method**, **port**, and **pathname** with globs.

```js
server.request((req, res) => {
  if (request.match('GET:80 /')) {
    // runs whenever the root is requested on port 80 using the GET method
  }

  if (request.match(':80 /')) {
    // runs whenever the root is requested on port 80 using any method
  }

  if (request.match('/')) {
    // runs whenever the root is requested on any port using any method
  }

  if (request.match('GET /')) {
    // runs whenever the root is requested on any port using the GET method
  }

  if (request.match('GET')) {
    // runs whenever any path is requested on any port using the GET method
  }

  if (request.match(':80')) {
    // runs whenever any path is requested on port 80 using any method
  }

  if (request.match('/**.js')) {
    // runs whenever any path ending in .js is requested on any port using any method
  }

  if (request.match('/**/*')) {
    // runs whenever a subdir path of any depth is requested on any port using any method
  }
});
```

## response

Each `response` is identical to
[`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)
with the addition of the following chainable properties.

### response.send

The `send` function sends an HTTP response and ends the response.

```js
res.send('<p>some html</p>');
```

A status may also be specified.

```js
res.status(404, 'Sorry, we cannot find that!');
```

### response.redirect

The `redirect` function redirects to a new URL.

```js
response.redirect('/foo/bar');
```

A specified status may also be specified.

```js
response.redirect(301, 'http://example.com');
```

If not specified, the status defaults to `302`.

### response.set

The `set` function sets header fields.

```js
response.set('Content-Type', 'text/plain');
```

Multiple fields may be specified at once.

```js
response.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  'ETag': '12345'
});
```

### response.status

The `status` function sets the HTTP status for the response.

```js
res.status(403).end();
```

```js
res.status(400).send('Bad Request');
```

```js
res.status(404).sendFile('/absolute/path/to/404.png');
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
