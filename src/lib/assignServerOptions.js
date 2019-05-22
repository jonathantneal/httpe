import generateCertificate from '../generateCertificate';
import map from './map';

/**
* @function assignServerOptions
* @desc Configures options or `connectionListener` on the {@link Server}.
* @param {Server} server - The current {@link Server}.
* @param {Object} [options] - The options for the server or `connectionListener`.
* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
* @param {Array|Number} [options.port] - The desired port or ports to use.
* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
* @param {Function} [connectionListener] - The listener bound to all connections.
* @returns {Void}
*/

function assignServerOptions (server, options) {
	// private data
	const data = map.get(server);

	const isListenAnAssignment = Array.isArray(options.listen) || typeof options.listen === 'number';

	// certificate options
	if ('cert' in options) {
		server.cert = options.cert;
	}

	if ('key' in options) {
		server.key = options.key;
	}

	if (!server.cert && !server.key) {
		const certificate = generateCertificate();

		Object.assign(server, certificate);
	}

	// IncomingMessage/ServerResponse options
	if ('IncomingMessage' in options) {
		server.IncomingMessage = options.IncomingMessage;
	}

	// ServerResponse option
	if ('ServerResponse' in options) {
		server.ServerResponse = options.ServerResponse;
	}

	// useAvailablePort option
	if (isListenAnAssignment || options.useAvailablePort) {
		server.useAvailablePort = true;
	}

	// port option
	if (isListenAnAssignment || options.useAvailablePort || ('port' in options)) {
		data.port = getNormalizedPort(
			isListenAnAssignment
				? options.listen
			: 'port' in options
				? options.port
			: data.port,
			data.port
		);
	}
}

function getNormalizedPort (port, originalPort) {
	// normalized port
	return Array.isArray(port)
		? port.map(
			number => Number(number)
		).filter(
			number => number
		)
	: Number(port)
		? [Number(port)]
	: originalPort;
}

export default assignServerOptions;
