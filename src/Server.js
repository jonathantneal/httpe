import close from './Server/close';
import https from 'https';
import listen from './Server/listen';
import constructor from './Server/constructor';

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

export default class Server extends https.Server {
	constructor () {
		super();

		constructor.apply(this, arguments);
	}

	listen () {
		listen.apply(this, arguments);

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

/**
* @external http.Server
* @see https://nodejs.org/api/http.html#http_class_http_server
* @external https.Server
* @see https://nodejs.org/api/https.html#https_class_https_server
* @external tls.Server
* @see https://nodejs.org/api/tls.html#tls_class_tls_server
*/
