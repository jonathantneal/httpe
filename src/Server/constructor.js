import enableCrossProtocolConnections from '../lib/enableCrossProtocolConnections';
import assignServerOptions from '../lib/assignServerOptions';
import IncomingMessage from '../IncomingMessage';
import ServerResponse from '../ServerResponse';

/**
* Creates a new HTTP & HTTPS Server that supports multiple ports.
* @param {Object} [options] - The options for the server or `connectionListener`.
* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
* @param {Array|Number} [options.port] - The desired port or ports to use.
* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
* @param {Function} [connectionListener] - The listener bound to all connections.
* @return {Server}
*/

function constructor (...args) {
	Object.assign(
		enableCrossProtocolConnections(this),
		{
			_servers: [],
			IncomingMessage,
			port: [80, 443],
			ServerResponse,
			useAvailablePort: false
		}
	);

	const requestListener = typeof args[args.length - 1] === 'function' && args.pop();

	// options argument
	const options = Object(args[0]);

	assignServerOptions(this, options);

	// listen option
	if (options.listen) {
		this.listen();
	}

	// requestListener argument
	if (typeof requestListener === 'function') {
		this.on('request', requestListener);
	}
}

export default constructor;
