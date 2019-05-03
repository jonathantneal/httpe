import http from 'http';

/**
* @name ServerResponse
* @class
* @extends http.ServerResponse
* @classdesc Creates the `response` object used to define server status, headers and data.
* @return {ServerResponse}
*/

class ServerResponse extends http.ServerResponse {
	/**
	* Redirects to a URL path, with a customizable status code. If not specified, status defaults to “302 “Found”.
	* @param {Number} [statusCode=302] - The HTTP response status code.
	* @param {String} [path] - The URL path to redirect to.
	* @return {Server}
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
	* Set the HTTP response body and end the response.
	* @param {Number} [status] - The HTTP response status code.
	* @param {Number} [headers] - The HTTP response headers.
	* @param {Buffer|Promise|*} [body] - The HTTP response body.
	* @return {Server}
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
	* @return {Server}
	*/

	setHeader () {
		const [field, value] = arguments;

		if (!this.finished) {
			if (arguments.length === 1) {
				for (const name in Object(field)) {
					const fieldValue = field[name];

					if (fieldValue !== null && fieldValue !== undefined) {
						this.setHeader(name, fieldValue);
					}
				}
			} else if (value !== null && value !== undefined) {
				http.ServerResponse.prototype.setHeader.call(this, field, value);
			}
		}

		return this;
	}

	/**
	* Sets the HTTP status for the response.
	* @return {Server}
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

export default ServerResponse;
