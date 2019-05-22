import { createServer } from 'net';

/**
* @private
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

function isPortAvailable (port = 80, useAvailablePort) {
	return new Promise(
		(resolve, reject) => {
			const server = createServer().on(
				'error',
				error => useAvailablePort && error.code === 'EADDRINUSE' ? server.listen(++port) : reject(error)
			).on(
				'listening',
				() => server.close(() => resolve(port))
			).listen(port);
		}
	);
}

export default isPortAvailable;
