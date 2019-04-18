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

	set () {
		const [fieldOrObject, value] = arguments;

		if (!this.finished) {
			if (typeof fieldOrObject === 'string') {
				this.setHeader(fieldOrObject, value);
			} else {
				for (const field in Object(fieldOrObject)) {
					this.setHeader(field, fieldOrObject[field]);
				}
			}
		}

		return this;
	}

	status (code) {
		this.statusCode = code;

		return this;
	}
}
