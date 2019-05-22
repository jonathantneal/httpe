import assignServerOptions from './lib/assignServerOptions';
import https from 'https';
import map from './lib/map';
import os from 'os';
import serverClose from './Server/close';
import serverConstructor from './Server/constructor';
import serverListen from './Server/listen';

/**
* @name Server
* @class
* @extends https.Server
* @classdesc Creates a new HTTP & HTTPS Server that supports multiple ports.
* @param {Object} [options] - The options for the server or `connectionListener`.
* @param {Boolean} [options.useAvailablePort] - Whether to use the next available port if the desired port is unavailable.
* @param {Boolean} [options.listen] - Whether to listen automatically.
* @param {Number} [options.listen] - Whether to listen automatically, and to define the desired port or ports to use.
* @param {Array|Number} [options.port] - The desired port or ports to use.
* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
* @param {Function} [connectionListener] - The listener bound to all connections.
* @returns {Server}
* @example <caption>Create a server on port 8080 that is automatically listening</caption>
* server = new Server({ port: 8080, listen: true })
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
	* @returns {Server}
	* @example
	* server.listen(() => {
	*   console.log(
	*     `httpe is listening…\n` +
	*     `--------------------------------------\n` +
	*     `   Local: ${server.port.map(port => `http://localhost:${port}/`).join('\n          ')}\n` +
	*     `External: ${server.port.map(port => `http://${server.ip}:${port}/`).join('\n          ')}\n` +
	*     `--------------------------------------`
	*   )
	* })
	*/

	listen () {
		serverListen.apply(this, arguments);

		return this;
	}

	/**
	* Stops the server from accepting new connections.
	* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
	* @returns {Server}
	* @example
	* server.close(() => {
	*   console.log(`httpe has closed…`)
	* })
	*/

	close (callback) {
		serverClose.call(this, callback);

		return this;
	}

	/**
	* Attach visitor functions on requests to the server.
	* @param {Object|String|RegExp} [pattern] - The pattern used to match requests.
	* @param {Function} [callback] - The method called whenever a request is made and/or matched.
	* @returns {Server}
	* @example
	* server.use((req, res) => {
	*   // do something with any request
	* })
	* @example <caption>Do</caption>
	* server.use('/\**.js', (req, res) => {
	*   // do something with any request ending in .js
	* })
	*/

	use (callback) {
		if (arguments.length > 1) {
			const [includes, callback] = arguments;

			this._uses.push({ includes, callback });
		} else {
			this._uses.push({ callback });
		}

		return this;
	}

	/**
	* @type {String}
	* @desc Gets the first external IP address for the server.
	* @example <caption>Get the current IP address of the server.</caption>
	* server.ip // '127.0.0.1'
	*/

	get ip () {
		const interfaces = os.networkInterfaces();

		for (const name in interfaces) {
			for (const address of interfaces[name]) {
				if (address.family === 'IPv4' && !address.internal) {
					return address.address;
				}
			}
		}

		return '127.0.0.1';
	}

	/**
	* @type {Boolean}
	* @desc Returns whether the server is currently listening.
	* @example <caption>Check if the server is currently listening.</caption>
	* server.listening // true or false
	*/

	get listening () {
		return map.get(this).listening;
	}

	/**
	* @type {Array}
	* @desc Returns or assigns the ports currently being requested.
	* @example <caption>Get the current ports in use.</caption>
	* server.port // [80, 443]
	* @example <caption>Set the current ports in use.</caption>
	* server.port = 80
	* server.port // [80]
	*/

	get port () {
		return map.get(this).port;
	}

	set port (port) {
		if (this.listening) {
			serverListen.call(this, { port });
		} else {
			assignServerOptions(this, { port });
		}
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
