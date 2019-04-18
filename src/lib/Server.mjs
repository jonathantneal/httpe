import allowCrossProtocolConnections from './allowCrossProtocolConnections';
import close from './close';
import getNormalizedPortFromArguments from './getNormalizedPortFromArguments';
import https from 'https';
import { parse } from 'url';
import { isPortAvailable, getFirstAvailablePort } from './availablePortUtils';
import listen from './listen';

/**
* @name Server
* @class
* @extends https.Server
* @classdesc Creates a new HTTP & HTTPS Server that supports multiple ports.
* @param {Object} [options] - The options for the server
* @param {Function} [connectionListener] - The listener bound to all connections.
* @return {Server}
*/

export default class Server extends https.Server {
	constructor () {
		super(...arguments);

		Object.assign(allowCrossProtocolConnections(this), {
			_requests: [],
			_servers: [],
			port: getNormalizedPortFromArguments(arguments)
		});

		this.on('request', (request, response) => {
			const { pathname } = parse(request.url);

			this._requests.forEach(_request => {
				if (
					(!_request.method || _request.method === request.method) &&
					(!_request.port || _request.port === request.connection.server.port) &&
					(!_request.glob || _request.glob.test(pathname)) &&
					(typeof _request.callback === 'function')
				) {
					_request.callback.call(this, request, response);
				}
			});
		});
	}

	/**
	* Start a server listening for connections.
	* @param {Number|Array} [port] - The port(s) used to listen for connections.
	* @param {Function} [listeningListener] - The method called when the server has been bound.
	* @return {Server}
	*/

	listen () {
		return listen.apply(this, arguments);
	}

	/**
	* Stops the server from accepting new connections and keeps existing connections.
	* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
	* @return {Server}
	*/

	close (callback) {
		return close.call(this, callback);
	}

	/**
	* Returns a promise for whether the port is available for a connection.
	* @param {Number} port - The port for the connection.
	* @return {Promise} A promise for whether the port is availale for a connection.
	*/

	isPortAvailable () {
		return isPortAvailable(...arguments);
	}

	/**
	* Returns a promise for the first available port for a connection.
	* @description Return a promise for the first available port for a connection.
	* @param {Number} port - The port for the connection.
	* @param {...Number} ignorePorts - The ports to be ignored for the connection.
	* @return {Promise} A promise for the first available port for a connection.
	*/

	getFirstAvailablePort () {
		return getFirstAvailablePort(...arguments);
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
