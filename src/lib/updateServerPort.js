import isPortAvailable from '../isPortAvailable';

export default function updateServerPort (server, desiredPort) {
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
