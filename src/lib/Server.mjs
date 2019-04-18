import allowCrossProtocolConnections from './allowCrossProtocolConnections';
import getNormalizedListenerArguments from './getNormalizedListenerArguments';
import getNormalizedPortFromArguments from './getNormalizedPortFromArguments';
import getNormalizedRequestFromPath from './getNormalizedRequestFromPath';
import https from 'https';

const { close, listen } = https.Server.prototype;

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
			this._requests.forEach(_request => {
				if (
					(!_request.method || _request.method === request.method) &&
					(!_request.port || _request.port === request.connection.server.port) &&
					(!_request.glob || _request.glob.test(request.url)) &&
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
		const [ options, callback ] = getNormalizedListenerArguments(arguments);

		this.port = options.port || this.port;

		new Promise(
			resolve => this.close(resolve)
		).then(
			() => Promise.all(
				[].concat(this.port).map(
					port => new Promise(
						resolve => {
							const server = allowCrossProtocolConnections(
								new https.Server(this)
							);

							listen.call(
								server,
								{ ...options, port },
								() => {
									resolve(
										Object.assign(server, {
											_events: this._events,
											_originalEvents: server._events,
											port
										})
									);
								}
							);
						}
					)
				)
			)
		).then(
			servers => {
				this._servers.splice(this._servers.length, 0, ...servers);

				this.emit('listening');
			}
		);

		if (typeof callback === 'function') {
			this.on('listening', callback);
		}

		return this;
	}

	/**
	* Stops the server from accepting new connections and keeps existing connections.
	* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
	* @return {Server}
	*/

	close (callback) {
		Promise.all(
			this._servers.splice(0).map(
				server => new Promise(resolve => {
					server._events = server._originalEvents;

					close.call(server, resolve);

					if (server._socket) {
						server._socket.end();
					}
				})
			)
		).then(
			servers => {
				if (servers.length) {
					close.call(this);
				}

				if (typeof callback === 'function') {
					callback.call(this);
				}
			}
		);

		return this;
	}

	/**
	* Attaches a request listener for when a path is matched to run a callback.
	* @param {String} [path] - The method, port, and pathname of the request.
	* @param {Function} callback - The function to run when a path is matched.
	*/

	request (path, callback) {
		const [ method, port, glob ] = getNormalizedRequestFromPath(typeof path === 'string' ? path : '');

		this._requests.push({
			method,
			port,
			glob,
			callback: typeof path === 'function' ? path : callback
		});

		return this;
	}

	/**
	* Detaches a request listener for when a path is matched to run a callback.
	* @param {String} path - The method, port, and pathname of the request.
	* @param {Function} [callback] - The function to run when a path is matched.
	*/

	removeRequest (path) {
		const [ method, port, glob ] = getNormalizedRequestFromPath(path);
		const [, callback] = arguments;

		for (
			let index = this._requests.length, _request;
			(_request = this._requests[--index]);
		) {
			if (
				(!method || method === _request.method) &&
				(!port || port === _request.method) &&
				(String(glob) === String(_request.glob)) &&
				(!callback || callback === _request.callback)
			) {
				this._requests.splice(index, 1);
			}
		}

		return this;
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
