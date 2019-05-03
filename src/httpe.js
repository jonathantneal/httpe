import generateCertificate from './generateCertificate';
import https from 'https';
import IncomingMessage from './IncomingMessage';
import isPortAvailable from './isPortAvailable';
import mimeTypes from 'mime-types';
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
	* @func
	* @desc Creates a new HTTP & HTTPS Server that supports multiple ports.
	* @param {Object} [options] - The options for the server or `connectionListener`.
	* @param {Boolean} [options.useAvailablePort] - Whether to use the first available port from the desired port or ports.
	* @param {Boolean} [options.listen] - The overriding desired port or ports to use if they are available, otherwising using the first available.
	* @param {Array|Number} [options.port] - The desired port or ports to use.
	* @param {Buffer|String} [options.cert] - The certificate; when missing along with `options.key` will cause a new certificate to be generated.
	* @param {Buffer|String} [options.key] - The key; when missing along with `options.cert` will cause a new certificate to be generated.
	* @param {Function} [connectionListener] - The listener bound to all connections.
	* @return {Server}
	*/

	createServer () {
		return new Server(...arguments);
	},

	/**
	* @name generateCertificate
	* @func
	* @desc Generates a new SSL certificate.
	* @param {Array|Object} props - A map of OID subject items.
	* @param {Object} opts - Additional certificate configuration.
	* @return {Object} The certificate (`cert`) and private key (`key`).
	*/

	generateCertificate,

	/**
	* @name getCharset
	* @func
	* @desc Returns the character set of a given path.
	* @param {String} path - The path used to determine the charset.
	* @return {String|Null} The determined charset set or null.
	*/

	getCharset (path) {
		return mimeTypes.charset(mimeTypes.lookup(path)) || null;
	},

	/**
	* @name getContentType
	* @func
	* @desc Returns the content type of a given path.
	* @param {String} path - The path used to determine the content-type.
	* @return {String|Null} The determined content-type or null.
	*/

	getContentType (path) {
		return mimeTypes.contentType(mimeTypes.lookup(path)) || null;
	},

	/**
	* @name getMimeType
	* @func
	* @desc Returns the mime type of a given path.
	* @param {String} path - The path used to determine the mimetype.
	* @return {String|Null} The determined mimetype or null.
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
	* @func
	* @desc Returns a promise for whether a port is available for a connection.
	* @param {Number} port - The port tested for an available connection.
	* @param {Boolean} useAvailablePort - Whether to use the first available port.
	* @return {Promise} A promise resolving with the available port or rejecting with the error.
	*/

	isPortAvailable,

	/**
	* @name Server
	* @desc Creates a new HTTP & HTTPS Server that supports multiple ports. See {@link Server}.
	* @implements {Server}
	*/

	Server,

	/**
	* @name ServerResponse
	* @desc Creates the `response` object used to define server status, headers and data. See {@link ServerResponse}.
	* @implements {ServerResponse}
	*/

	ServerResponse
};

export default httpe;
