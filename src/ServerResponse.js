import http from 'http';

export default class ServerResponse extends http.ServerResponse {
	/**
	* Set the HTTP response body and end the response.
	* @param {Number} [status] - The HTTP response status code.
	* @param {Number} [headers] - The HTTP response headers.
	* @param {Number} [body] - The HTTP response body.
	* @return {Server}
	*/

	set () {
		const [status, headers, body] = arguments;

		if (!this.finished) {
			if (typeof status === 'string') {
				// set('content')
				this.end(status);
			} else if (typeof status === 'number') {
				this.statusCode = status;

				if (typeof headers === 'string') {
					// set(200, 'content')
					this.end(headers);
				} else if (headers === Object(headers)) {
					if (typeof headers.pipe === 'function') {
						// set(200, stream);
						headers.pipe(this);
					} else {
						this.setHeader(headers);

						if (body === Object(body) && typeof body.pipe === 'function') {
							// set(200, {}, stream)
							body.pipe(this);
						} else {
							// set(200, {}, 'content')
							this.end(typeof body === 'string' ? body : '');
						}
					}
				}
			} else if (status === Object(status)) {
				if (typeof status.pipe === 'function') {
					// set({}, stream);
					status.pipe(this);
				} else {
					this.setHeader(status);

					// set({}, 'content')
					this.end(typeof headers === 'string' ? headers : '');
				}
			}
		}

		return this;
	}

	redirect () {
		const [statusOrPath, path] = arguments;

		if (!this.finished) {
			if (typeof statusOrPath === 'string') {
				this.writeHead(302, {
					Location: statusOrPath
				});
				this.end();
			} else if (typeof statusOrPath === 'number' && typeof path === 'string') {
				this.writeHead(statusOrPath, {
					Location: path
				});
				this.end();
			}
		}

		return this;
	}

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

	status (code) {
		this.statusCode = code;

		return this;
	}
}
