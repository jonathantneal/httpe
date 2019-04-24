# httpe [<img src="https://jonathantneal.github.io/node-logo.svg" alt="" width="90" height="90" align="right">][httpe]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[httpe] is a 2.42 KB zero-dependency [`http`] and [`https`] replacement module
that supports multiple protocols and ports simultaneously. It generates SSL
certificates if they are missing, and includes URL and path glob tooling as
well as charset and mimetype detection.

```bash
npm install httpe
```

```js
const httpe = require('httpe');

// start an http/https server on ports 80/443
httpe.createServer().listen().on(
  'request',
  (request, res) => {
    if (request.includes('GET:80 /')) {
      // Homepage: show a custom message
      res.set('A request for the root on port 80 using the GET method');
    } else if (request.includes('/**.js')) {
      // JavaScript: show a confusing message
      res.set(`eval does a body good`);
    } else {
      // Anything Else: show the method, port, and URL of the request
      res.set(`${request.method}:${request.connection.server.port} ${request.pathname}`);
    }
  }
);
```

It also supports initial configuration of the port.

```js
// start an http/https server on port 8080
httpe.createServer({ port: 8080 }).listen();
```

## httpe.createServer()

The `createServer` method returns a new instance of a [`Server`](#httpe.Server).

```js
server = httpe.createServer();
```

Arguments are identical to
[https.createServer](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)
with the additions of; `port` which specifies the port or ports to be used by
the server, `listen` which immediately starts the server, and
`useAvailablePort` which instructs the server to use the first available port.

```js
server = httpe.createServer({ port: 8080 });
```

```js
// start the server immediately on port 8080
server = httpe.createServer({ port: 8080, listen: true });
```

```js
// start the server immediately on the first available port from 8080
server = httpe.createServer({ port: 8080, listen: true, useAvailablePort: true });
```

When a number, `listen` defines the `port` _and_ instructs the server to use
the first available port.

```js
// start the server immediately on the first available port from 8080
server = httpe.createServer({ listen: 8080 });
```

### httpe.isPortAvailable()

The `isPortAvailable` function returns a Promise for whether a port is
available for a connection, with the option to use the next available port.

```js
// check port 80
httpe.isPortAvailable(80).then(availablePort => {}, error => {});
```

```js
// check any port from 80
httpe.isPortAvailable(80, true).then(availablePort => {}, error => {});
```

## httpe.Server()

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

---

## request

Each `request` is identical to
[`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage)
with the addition of properties available to new
[`URL`](https://nodejs.org/api/url.html#url_class_url) instances.

```js
request.pathname; // the pathname does not include search params
```

## request.includes()

The `includes` function returns whether a search pattern matches the current
request.

The path may contain a **method**, **port**, and **pathname** with globs.

```js
server.request((req, res) => {
  if (request.includes('GET:80 /')) {
    // runs whenever the root is requested on port 80 using the GET method
  }

  if (request.includes(':80 /')) {
    // runs whenever the root is requested on port 80 using any method
  }

  if (request.includes('/')) {
    // runs whenever the root is requested on any port using any method
  }

  if (request.includes('GET /')) {
    // runs whenever the root is requested on any port using the GET method
  }

  if (request.includes('GET')) {
    // runs whenever any path is requested on any port using the GET method
  }

  if (request.includes(':80|443')) {
    // runs whenever any path is requested on port 80 or 443 using any method
  }

  if (request.includes('/**.js')) {
    // runs whenever any path ending in .js is requested on any port using any method
  }

  if (request.includes('/**/*')) {
    // runs whenever a subdir path of any depth is requested on any port using any method
  }
});
```

### request.charset

The `charset` property returns the default character set for the request
pathname.

```js
// If the request.pathname is `/script.js`
request.charset; // returns 'UTF-8'
```

### request.contentType

The `contentType` property returns the default content type for the request
pathname.

```js
// If the request.pathname is `/script.js`
request.contentType; // returns 'application/javascript; charset=utf-8'
```

### request.mimeType

The `mimeType` property returns the default mime type for the request pathname.

```js
// If the request.pathname is `/script.js`
request.mimeType; // returns 'application/javascript'
```

---

## response

Each `response` is identical to
[`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)
with the addition of the following chainable properties.

### response.set()

The `set` function sets an HTTP response body and ends the response.

```js
res.set('<p>some html</p>');
```

The status code may also be specified.

```js
res.set(404, 'Sorry, we cannot find that!');
```

The response body may also be a stream.

```js
res.set(400, someStream);
```

### response.redirect

The `redirect` function redirects to a new URL.

```js
response.redirect('/foo/bar');
```

A status code may also be specified.

```js
response.redirect(301, 'http://example.com');
```

If not specified, the status code defaults to `302`.

### response.setHeader

The `setHeader` function sets HTTP response headers.

```js
response.setHeader('Content-Type', 'text/plain');
```

Multiple fields may be specified at once.

```js
response.setHeader({
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
res.status(400).set('Bad Request');
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
