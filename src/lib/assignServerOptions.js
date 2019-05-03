import generateCertificate from '../generateCertificate';
import updateServerPort from './updateServerPort';

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
* @return {Void}
*/

function assignServerOptions (server, options) {
	const isListenPort = typeof options.listen === 'number';

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
	if (isListenPort || options.useAvailablePort) {
		server.useAvailablePort = true;
	}

	// port option
	if (isListenPort || options.useAvailablePort || ('port' in options)) {
		updateServerPort(
			server,
			isListenPort
				? options.listen
			: options.port
		);
	}
}

export default assignServerOptions;
