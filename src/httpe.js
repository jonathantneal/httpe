import generateCertificate from './generateCertificate';
import getPathStats from './getPathStats';
import https from 'https';
import IncomingMessage from './IncomingMessage';
import isPortAvailable from './isPortAvailable';
import mimeTypes from 'mime-types';
import os from 'os';
import Server from './Server';
import ServerResponse from './ServerResponse';

/**
* @module httpe
* @desc The HTTP interface designed to support http & https protocols & multiple ports simultaneously.
*/

const httpe = {
	...https,

	/**
	* @name createServer
	* @function
	* @desc Creates a new HTTP & HTTPS Server that supports multiple ports.
	* @param {Object} [options] - The options for the server or `connectionListener`.
	* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
	* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
	* @param {Array|Number} [options.port] - The desired port or ports to use.
	* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
	* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
	* @param {Function} [connectionListener] - The listener bound to all connections.
	* @returns {Server}
	* @example <caption>Create a server on port 8080 that is automatically listening</caption>
	* server = new httpe.createServer({ port: 8080, listen: true })
	*/

	createServer () {
		return new Server(...arguments);
	},

	/**
	* @name generateCertificate
	* @function
	* @desc Generates a new SSL certificate.
	* @param {Array|Object} props - A map of OID subject items.
	* @param {Object} opts - Additional certificate configuration.
	* @returns {Object} The certificate (`cert`) and private key (`key`).
	* @example
	* cert = new httpe.generateCertificate({
	*   commonName: 'example.org',
	*   countryName, 'US',
	*   localityName: 'Blacksburg',
	*   organizationName: 'Test'
	* })
	*/

	generateCertificate,

	/**
	* @name getCharset
	* @function
	* @desc Returns the character set of a given path.
	* @param {String} path - The path used to determine the charset.
	* @returns {String|Null} The determined charset set or null.
	* @example
	* httpe.getCharset('/script.js') // 'UTF-8'
	*/

	getCharset (path) {
		return mimeTypes.charset(mimeTypes.lookup(path)) || null;
	},

	/**
	* @name getContentType
	* @function
	* @desc Returns the content type of a given path.
	* @param {String} path - The path used to determine the content-type.
	* @returns {String|Null} The determined content-type or null.
	* @example
	* httpe.contentType('/script.js') // 'application/javascript; charset=utf-8'
	*/

	getContentType (path) {
		return mimeTypes.contentType(mimeTypes.lookup(path)) || null;
	},

	/**
	* @name getPathStats
	* @function
	* @desc Returns the file stats for a given path.
	* @param {String} path - The path used to get stats.
	* @param {Object} [opts] - Additional configuration resolving file stats.
	* @param {Object} [opts.from = '.'] - The directory used to resolve the path.
	* @param {Object} [opts.index = 'index.html'] - The index basename used to resolve directories.
	* @async
	* @returns {Stats} A promise resolving with the matching path and file stats, or an error if it failed.
	* @example
	* httpe.getPathStats('/path/to/dir').then(stats => {
	*   // get the resolved path
	*   const isPathAFile = stats.path
	*
	*   // get whether the path is a file
	*   const isPathAFile = stats.isFile()
	*
	*   // destructure additional custom stats
	*   const { charset, contentLength, contentType, lastModified, mimeType, path } = stats
	* })
	*/

	getPathStats (path, opts) {
		return getPathStats(path, opts);
	},

	/**
	* @name getMimeType
	* @function
	* @desc Returns the mime type of a given path.
	* @param {String} path - The path used to determine the mimetype.
	* @returns {String|Null} The determined mimetype or null.
	* @example
	* httpe.getCharset('/script.js') // 'application/javascript'
	*/

	getMimeType (path) {
		return mimeTypes.lookup(path) || null;
	},

	/**
	* @name IncomingMessage
	* @desc Creates the `request` object used to access client status, headers and data. See {@link IncomingMessage}.
	* @implements {IncomingMessage}
	*/

	IncomingMessage,

	/**
	* @name isPortAvailable
	* @async
	* @function
	* @desc Returns a promise for whether a port is available for a connection.
	* @param {Number} port - The port tested for an available connection.
	* @param {Boolean} useAvailablePort - Whether to use the first available port.
	* @async
	* @returns {Number|Error} A promise resolving with the available port or rejecting with the error.
	* @example
	* httpe.isPortAvailable(80).then(availablePort => {}, error => {});
	* @example <caption>Get any available port from 80 onward</caption>
	* httpe.isPortAvailable(80, true).then(availablePort => {}, error => {});
	*/

	isPortAvailable,

	/**
	* @name Server
	* @desc Creates a new HTTP & HTTPS Server that supports multiple ports. See {@link Server}.
	* @implements {Server}
	* @example <caption>Create a server on port 8080 that is automatically listening</caption>
	* server = new httpe.Server({ port: 8080, listen: true })
	*/

	Server,

	/**
	* @name ServerResponse
	* @desc Creates the `response` object used to define server status, headers and data. See {@link ServerResponse}.
	* @implements {ServerResponse}
	*/

	ServerResponse,

	/**
	* @type {String}
	* @desc Gets the first external IP address for the server.
	* @example <caption>Get the current IP address of the server.</caption>
	* httpe.ip // '127.0.0.1'
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
};

export default httpe;

/**
* The file stats for a given path. Extends {@link https://nodejs.org/api/fs.html#fs_class_fs_stats fs.Stats}.
* @typedef {Object} Stats
* @property {number} charset - The X Coordinate
* @property {number} contentLength - The Y Coordinate
* @property {number} contentType - The X Coordinate
* @property {number} lastModified - The Y Coordinate
* @property {number} mimeType - The X Coordinate
* @property {number} path - The Y Coordinate
*/
