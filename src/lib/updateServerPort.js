import isPortAvailable from '../isPortAvailable';

/**
* @function updateServerPort
* @desc Updates the server port with the nearest one available for a connection.
* @param {Server} server - The current {@link Server}.
* @param {Array|Number} desiredPort - The desired port to use or start looking from.
* @return {Void}
*/

function updateServerPort (server, desiredPort) {
	const port = Array.isArray(desiredPort)
		? desiredPort.map(
			each => Number(each)
		)
	: Number(desiredPort) || [80, 443];

	server.port = server.useAvailablePort
		? Promise.resolve(server.port).then(
			() => typeof port === 'number'
				? isPortAvailable(port, true)
			: Promise.all(
				port.map(
					each => isPortAvailable(each, true)
				)
			)
		).then(
			availablePort => server.port = availablePort
		)
	: port;
}

export default updateServerPort;
