import { hasProperty, isArray, isInteger } from './is';
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

	const isListenAnAssignment = isArray(options.listen) || isInteger(options.listen);

	// certificate options
	if (hasProperty(options, 'cert')) {
		server.cert = options.cert;
	}

	if (hasProperty(options, 'key')) {
		server.key = options.key;
	}

	if (!hasProperty(server, 'cert') && !hasProperty(server, 'key')) {
		const certificate = generateCertificate();

		Object.assign(server, certificate);
	}

	// IncomingMessage/ServerResponse options
	if (hasProperty(options, 'IncomingMessage')) {
		server.IncomingMessage = options.IncomingMessage;
	}

	// ServerResponse option
	if (hasProperty(options, 'ServerResponse')) {
		server.ServerResponse = options.ServerResponse;
	}

	// useAvailablePort option
	if (isListenAnAssignment || options.useAvailablePort) {
		server.useAvailablePort = true;
	}

	// port option
	if (isListenAnAssignment || options.useAvailablePort || hasProperty(options, 'port')) {
		data.port = getNormalizedPort(
			isListenAnAssignment
				? options.listen
			: hasProperty(options, 'port')
				? options.port
			: data.port,
			data.port
		);
	}
}

function getNormalizedPort (port, originalPort) {
	// normalized port
	return isArray(port)
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
