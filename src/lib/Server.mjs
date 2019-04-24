import allowCrossProtocolConnections from './util/allowCrossProtocolConnections';
import close from './close';
import generateCertificate from './util/generateCertificate';
import isPortAvailable from './util/isPortAvailable';
import https from 'https';
import listen from './listen';

/**
* @name Server
* @class
* @extends https.Server
* @classdesc Creates a new HTTP & HTTPS Server that supports multiple ports.
* @param {Object} [options] - The options for the server
* @param {Array|Number} [options.port] - The desired port or ports to use.
* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
* @param {Function} [connectionListener] - The listener bound to all connections.
* @return {Server}
*/

export default class Server extends https.Server {
	constructor () {
		// optional arguments
		const [rawOptions, connectionListener] = arguments;

		// options argument
		const options = Object(rawOptions);

		super(options);

		// inner-servers
		this._servers = [];

		allowCrossProtocolConnections(this);

		// port option
		this.useAvailablePort = Boolean(typeof options.listen === 'number' || options.useAvailablePort);

		updateServerPort(this, options.port);

		// certificate option
		if (!options.cert && !options.key) {
			const certificate = generateCertificate();

			Object.assign(this, certificate);
		}

		// listen option
		if (options.listen) {
			Array.isArray(options.listen)
				? this.listen(...options.listen)
			: typeof options.listen === 'boolean'
				? this.listen()
			: this.listen(options.listen);
		}

		// connectionListener argument
		if (typeof connectionListener === 'function') {
			this.on('request', connectionListener);
		}
	}

	/**
	* Start a server listening for connections.
	* @param {Number|Array} [port] - The port(s) used to listen for connections.
	* @param {Function} [listeningListener] - The method called when the server has been bound.
	* @return {Server}
	*/

	listen () {
		const [port, ...args] = arguments;

		const portType = Object.prototype.toString.call(port);
		const isPortType = portType === '[object Number]' || portType === '[object Promise]';

		if (isPortType) {
			updateServerPort(this, port);
		}

		if (this.useAvailablePort) {
			Promise.resolve(this.port).then(
				() => isPortType
					? listen.call(this, this.port, ...args)
				: listen.call(this, arguments)
			);
		} else {
			listen.call(this, arguments);
		}

		return this;
	}

	/**
	* Stops the server from accepting new connections and keeps existing connections.
	* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
	* @return {Server}
	*/

	close (callback) {
		return close.call(this, callback);
	}
}

function updateServerPort (server, desiredPort) {
	const port = Array.isArray(desiredPort)
		? desiredPort.map(
			each => Number(each)
		)
	: Number(desiredPort) || [80, 443];

	server.port = server.useAvailablePort
		? Promise.resolve(server.port).then(
			() => typeof port === 'number'
				? isPortAvailable(port, true)
			: Promise.all(
				port.map(
					each => isPortAvailable(each, true)
				)
			)
		).then(
			availablePort => server.port = availablePort
		)
	: port;
}

/**
* @external http.Server
* @see https://nodejs.org/api/http.html#http_class_http_server
* @external https.Server
* @see https://nodejs.org/api/https.html#https_class_https_server
* @external tls.Server
* @see https://nodejs.org/api/tls.html#tls_class_tls_server
*/
