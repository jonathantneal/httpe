# httpe [<img src="https://jonneal.dev/node-logo.svg" alt="" width="90" height="90" align="right">][httpe]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[httpe] is a fully [`http`] & [`https`] compatible module that can support
simultanious ports & protocols, set or generate SSL certificates & charsets &
mimetypes, glob & chain requests, stream & process files, and more.

```bash
npm install httpe
```

```js
const httpe = require('httpe');

// immediately start an http/https server on ports 80/443
httpe.createServer({ listen: true }).use(
  'GET:80 /',
  // homepage: show a custom message
  (req, res) => res.send('A request for the root on port 80 using the GET method')
).use(
  '*.js',
  // js: show a confusing message
  (req, res) => res.sendJS(`eval does a body good`)
).use(
  // json: show a confusing message
  '*.json',
  (req, res) => res.sendJSON({ message: 'eval does a body good' })
).use(
  // anything else: show the method, port, and URL of the request
  (req, res) => res.send(`${req.method}:${req.connection.server.port} ${req.pathname}`)
).listen(server => {
  console.log(
    `httpe is listening…\n` +
    `--------------------------------------\n` +
    `   Local: ${server.port.map(port => `http://localhost:${port}/`).join('\n          ')}\n` +
    `External: ${server.port.map(port => `http://${httpe.ip}:${port}/`).join('\n          ')}\n` +
    `--------------------------------------`
  );
});
```

**httpe** is backwards-compatible with the [`http`] module.

```js
const httpe = require('httpe');

httpe.createServer((req, res) => {
  // do something with the request
}).listen();
```

## Additional Features

The `createServer` method returns a new instance of a [`Server`](#httpe.Server).
The `listen` property instructs the server to immediately begin, and giving it
a number defines the `port`.

```js
server = httpe.createServer({ port: 8080 });
```

```js
server = httpe.createServer({ port: [80, 443] });
```

The `useAvailablePort` property instructs the server to use the first available
port only if the specified port is not available.

```js
server = httpe.createServer({ listen: 8080, useAvailablePort: true });
```

---

### Additional Request Features

The `request` object is identical to
[`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) with the addition of properties
available to an [`URL`](https://nodejs.org/api/url.html#url_class_url).

```js
request.pathname; // the pathname does not include search params
```

The `request.includes` function returns whether a search pattern matches the
current request.

The path may contain a **method**, **port**, and **pathname** with globs.

```js
server.request((req, res) => {
  if (req.includes('GET:80 /')) {
    // runs whenever the root is requested on port 80 using the GET method
  }

  if (req.includes(':80 /')) {
    // runs whenever the root is requested on port 80 using any method
  }

  if (req.includes('/')) {
    // runs whenever the root is requested on any port using any method
  }

  if (req.includes('GET /')) {
    // runs whenever the root is requested on any port using the GET method
  }

  if (req.includes('GET')) {
    // runs whenever any path is requested on any port using the GET method
  }

  if (req.includes(':80|443')) {
    // runs whenever any path is requested on port 80 or 443 using any method
  }

  if (req.includes('*.js')) {
    // runs whenever any path ending in .js is requested on any port using any method
  }

  if (req.includes('/**/*')) {
    // runs whenever a subdir path of any depth is requested on any port using any method
  }
});
```

The `request.charset` property returns the default character set for the
requested pathname. The `request.contentType` property returns the default
content type for the requested pathname. The `request.mimeType` property
returns the default mime type for the requested pathname.

```js
// If the request.pathname is `/script.js`
request.charset; // returns 'UTF-8'
request.contentType; // returns 'application/javascript; charset=utf-8'
request.mimeType; // returns 'application/javascript'
```

---

### Additional Response Features

The `response` is identical to
[`http.ServerResponse`](https://nodejs.org/api/http.html#http_class_http_serverresponse)
with the addition of the following chainable properties.

The `send` function sends an HTTP response body and ends the response. When the
parameter is a Buffer, the `Content-Type` is set to `application/octet-stream`, and when it is a String, the `Content-Type` is set to `text/html`, and when the parameter is an Array or Object, the `Content-Type` is set to `text/json`.

```js
res.send('<p>some html</p>');
```

The `sendHTML`, `sendJS`, `sendJSON`, and `sendCSS` functions handle send
specific kinds of responses.

```js
res.sendHTML('<p>some html</p>');
```

A status code and headers may also be specified.

```js
res.send(404, 'Sorry, we cannot find that!');

res.send({
  status: 404,
  headers: { 'Content-Type': 'text/html' }
}, 'Sorry, we cannot find that!');
```

The `redirect` function redirects to a new URL. A status code may also be
specified.

```js
response.redirect('/foo/bar'); // 302

response.redirect(301, 'http://example.com'); // 301
```

The `setHeaders` function sets HTTP response headers, and multiple fields may
be specified at once.

```js
response.setHeaders('Content-Type', 'text/plain');

response.setHeaders({
  'Content-Type': 'text/plain',
  'Content-Length': 123
});
```

The `sendFile` function transfers a file, setting HTTP headers based on the
filename’s extension, size, and modified time.

```js
res.sendFile('path/to/file', { from: 'some/dir' });
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
