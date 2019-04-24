import { createServer } from 'net';

/**
* @function isPortAvailable
* @description return a promise for whether the port is available for a connection
* @param {Number} port - port for the connection
* @param {Boolean} useAvailablePort - Whether to use the first available port.
* @return {Promise} promise for whether the port is availale for a connection
*/

export default function isPortAvailable (port = 80, useAvailablePort) {
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
