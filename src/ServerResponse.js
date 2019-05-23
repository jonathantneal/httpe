import fs from 'fs';
import http from 'http';
import getPathStats from './lib/getPathStats';
import mimeTypes from 'mime-types';

/**
* @name ServerResponse
* @class
* @extends http.ServerResponse
* @classdesc Creates the `response` object used to define server status, headers and data.
* @returns {ServerResponse}
* @example <caption>Using `ServerResponse` within a request event listener</caption>
* function onRequest (response, request) {
*   response.set('<p>some html</p>');
* }
*/

class ServerResponse extends http.ServerResponse {
	/**
	* Redirects to a URL path, with a customizable status code. If not specified, status defaults to “302 “Found”.
	* @param {Number} [code=302] - The HTTP response status code.
	* @param {String} [path] - The URL path to redirect to.
	* @returns {Server}
	*/

	redirect () {
		if (!this.finished) {
			const args = Array.prototype.slice.call(arguments, 0, 2);
			const Location = args.pop();
			const status = args.pop() || 302;

			this.writeHead(status, { Location });
			this.end();
		}

		return this;
	}

	/**
	* Streams a local file from a given path. Sets `Content-Length`, `Content-Type`, `Date`, and `Last-Modified` headers.
	* @param {String} path - The path used to resolve the local file.
	* @param {Object} [opts] - Additional configuration resolving the local file.
	* @param {Object} [opts.cwd = '.'] - The directory used to resolve the local file.
	* @param {Object} [opts.index = 'index.html'] - The index basename used to resolve directories.
	* @param {Object} [opts.headers] - Additional HTTP response headers.
	* @async
	* @returns {ServerResponse} A promise resolving with the current {@link ServerResponse} once the file has been streamed.
	*/

	sendFile (path) {
		const [, opts] = arguments;

		return getPathStats(path, opts).then(
			stats => {
				this.statusCode = 200;

				this.setHeader({
					contentLength: stats.contentLength,
					contentType: stats.contentType,
					lastModified: stats.lastModified
				});

				const readStream = fs.createReadStream(stats.path);

				return new Promise((resolve, reject) => {
					readStream.on('open', () => {
						// when the readable stream is valid, pipe the read stream into the response
						readStream.pipe(this);
					}).on('error', error => {
						// when the readable stream catches an error, end the response with the error
						this.statusCode = 500;

						reject(error);
					}).on('end', () => {
						this.end();

						resolve(this);
					});
				});
			},
			error => {
				this.statusCode = 404;

				throw error;
			}
		);
	}

	/**
	* Set the HTTP response body and end the response.
	* @param {Number} [status] - The HTTP response status code.
	* @param {Number} [headers] - The HTTP response headers.
	* @param {Buffer|Promise|*} [body] - The HTTP response body.
	* @returns {Server}
	*/

	set (...args) {
		if (!this.finished) {
			const options = args.reduce(
				(options, arg) => {
					if (!('body' in options)) {
						if (isThenable(arg) || isPipeable(arg)) {
							return { ...options, body: arg };
						} else if (!('headers' in options)) {
							if (arg === Object(arg)) {
								return { ...options, headers: arg };
							} else if (!('status' in options)) {
								if (typeof arg === 'number') {
									return { ...options, status: arg };
								}
							}
						}
					}

					return { ...options, body: arg };
				},
				{}
			);

			if ('status' in options) {
				this.statusCode = options.status;
			}

			if ('headers' in options) {
				this.setHeader(options.headers);
			}

			if ('body' in options) {
				if (isPipeable(options.body)) {
					options.body.pipe(this);
				} else if (isThenable(options.body)) {
					this.finished = true;

					resolveBody(options.body).then(
						body => {
							this.end(body);
						}
					);
				} else {
					this.end(options.body);
				}
			} else {
				this.end();
			}
		}

		return this;
	}

	/**
	* Sets one or more to-be-sent headers.
	* @returns {Server}
	*/

	setHeader () {
		const [field, value] = arguments;

		if (!this.finished) {
			if (arguments.length === 1) {
				for (const name in Object(field)) {
					const fieldValue = field[name];

					if (fieldValue !== null && fieldValue !== undefined) {
						this.setHeader(toHeaderString(name), fieldValue);
					}
				}
			} else if (value !== null && value !== undefined) {
				http.ServerResponse.prototype.setHeader.call(this, field, value);
			}
		}

		return this;
	}

	/**
	* Set the HTTP response body as CSS and end the response.
	* @param {String} [html] - The HTTP response body as CSS.
	* @param {Object} [opts] - Additional configuration.
	* @returns {Server}
	*/

	setCSS (css, opts) {
		const body = String(css);

		return setServerX(this, body, 'css', opts);
	}

	/**
	* Set the HTTP response body as HTML and end the response.
	* @param {String} [html] - The HTTP response body as HTML.
	* @param {Object} [opts] - Additional configuration.
	* @returns {Server}
	*/

	setHTML (html, opts) {
		const body = String(html);

		return setServerX(this, body, 'html', opts);
	}

	/**
	* Set the HTTP response body as JavaScript and end the response.
	* @param {String} [js] - The HTTP response body as JavaScript.
	* @param {Object} [opts] - Additional configuration.
	* @returns {Server}
	*/

	setJS (js, opts) {
		const body = String(js);

		return setServerX(this, body, 'js', opts);
	}

	/**
	* Set the HTTP response body as JSON and end the response.
	* @param {*} [json] - The HTTP response to be stringified as JSON.
	* @param {Object} [opts] - Additional configuration for stringification.
	* @returns {Server}
	*/

	setJSON (json, opts) {
		const {
			replacer = null,
			space = '  '
		} = Object(opts);

		const body = JSON.stringify(json, replacer, space);

		return setServerX(this, body, 'json', opts);
	}

	/**
	* Sets the HTTP status for the response.
	* @returns {Server}
	*/

	status (code) {
		this.statusCode = code;

		return this;
	}
}

function isThenable (value) {
	return typeof Object(value).then === 'function'
}

function isPipeable (value) {
	return typeof Object(value).pipe === 'function'
}

function resolveBody (value) {
	return isThenable(value)
		? value.then(resolveBody)
	: toBodyString(value);
}

function toBodyString (value) {
	return value === Object(value) && !Object.hasOwnProperty.call(value, 'toString')
		? JSON.stringify(value)
	: String(value)
}

function toHeaderString (string) {
	return /-/.test(string)
		? string
	: string.replace(
		/[\w][A-Z]/g,
		$0 => `${$0[0]}-${$0[1]}`
	).replace(
		/^[a-z]/,
		$0 => $0.toUpperCase()
	);
}

function setServerX (server, body, extension, opts) {
	const {
		code = 200,
		headers: overrideHeaders
	} = Object(opts);

	const headers = Object.assign({
		contentLength: body.length,
		contentType: mimeTypes.lookup(extension)
	}, overrideHeaders);

	return server.set(code, headers, body);
}

export default ServerResponse;
