import http from 'http';

export default class ServerResponse extends http.ServerResponse {
	send () {
		const [statusOrBody, body] = arguments;

		if (!this.finished) {
			if (typeof statusOrBody === 'string') {
				this.end(statusOrBody);
			} else if (typeof statusOrBody === 'number') {
				this.statusCode = statusOrBody;

				if (typeof body === 'string') {
					this.end(body);
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
			} else if (typeof statusOrBody === 'number' && typeof path === 'string') {
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
