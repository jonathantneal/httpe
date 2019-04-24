import generateCertificate from './generateCertificate';
import https from 'https';
import IncomingMessage from './IncomingMessage';
import isPortAvailable from './isPortAvailable';
import mimeTypes from 'mime-types';
import Server from './Server';
import ServerResponse from './ServerResponse';

export default {
	...https,

	/**
	* Return a promise for a certificate.
	* @param {Array|Object} props - The properties/attributes used to generate the certificate.
	* @param {Object} opts - The options used to generate the certificate.
	* @return {Promise} (e.g. `{ cert, key }`).
	*/

	createServer () {
		return new Server(...arguments);
	},

	generateCertificate,

	/**
	* Return the character set of a given path.
	* @param {String} path - The path used to determine the charset.
	* @return {String|Null} The determined charset set or null.
	*/

	getCharset (path) {
		return mimeTypes.charset(mimeTypes.lookup(path)) || null;
	},

	/**
	* Return the content type of a given path.
	* @param {String} path - The path used to determine the content-type.
	* @return {String|Null} The determined content-type or null.
	*/

	getContentType (path) {
		return mimeTypes.contentType(mimeTypes.lookup(path)) || null;
	},

	/**
	* Return the mime type of a given path.
	* @param {String} path - The path used to determine the mimetype.
	* @return {String|Null} The determined mimetype or null.
	*/

	getMimeType (path) {
		return mimeTypes.lookup(path) || null;
	},

	IncomingMessage,

	/**
	* Returns a promise for whether a port is available for a connection.
	* @param {Number} port - The port tested for an available connection.
	* @param {Boolean} useAvailablePort - Whether to use the first available port.
	* @return {Promise} A promise resolving with the available port or rejecting with the error.
	*/

	isPortAvailable,

	Server,
	ServerResponse
}