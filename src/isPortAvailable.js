import { createServer } from 'net';

/**
* @private
* @name isPortAvailable
* @func
* Returns a promise for whether a port is available for a connection.
* @param {Number} port - The port tested for an available connection.
* @param {Boolean} useAvailablePort - Whether to use the first available port.
* @return {Promise} A promise resolving with the available port or rejecting with the error.
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
