import https from 'https';
import serverClose from './Server/close';
import serverConstructor from './Server/constructor';
import serverListen from './Server/listen';

/**
* @name Server
* @class
* @extends https.Server
* @classdesc Creates a new HTTP & HTTPS Server that supports multiple ports.
* @param {Object} [options] - The options for the server or `connectionListener`.
* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
* @param {Array|Number} [options.port] - The desired port or ports to use.
* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
* @param {Function} [connectionListener] - The listener bound to all connections.
* @return {Server}
*/

class Server extends https.Server {
	constructor () {
		super();

		serverConstructor.apply(this, arguments);
	}

	/**
	* Starts a server listening for connections.
	* @param {Function|Options|Port} [options] - The port used for connections, the options for the server, or the listener called once the server is bound.
	* @param {Function} [listener] - The listener called once the server has been bound.
	* @return {Server}
	*/

	listen () {
		serverListen.apply(this, arguments);

		return this;
	}

	/**
	* Stops the server from accepting new connections.
	* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
	* @return {Server}
	*/

	close (callback) {
		serverClose.call(this, callback);

		return this;
	}
}

export default Server;

/**
* @external http.Server
* @see https://nodejs.org/api/http.html#http_class_http_server
* @external https.Server
* @see https://nodejs.org/api/https.html#https_class_https_server
* @external tls.Server
* @see https://nodejs.org/api/tls.html#tls_class_tls_server
*/
