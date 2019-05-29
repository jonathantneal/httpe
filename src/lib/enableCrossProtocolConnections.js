import http from 'http';
import https from 'https';
import tlsConnectionListener from './tlsConnectionListener';

/**
* @function enableCrossProtocolConnections
* @desc Enables cross protocol connections from the server.
* @param {Server} server - The current {@link Server}.
* @returns {Server}
*/

function enableCrossProtocolConnections (server) {
	Object.assign(server, {
		_connectionListener: http._connectionListener,
		_tlsConnectionListener: server._events.connection,
		allowHalfOpen: true,
		httpAllowHalfOpen: false,
		timeout: 2 * 60 * 1000
	});

	https.Server.prototype.removeListener.call(server, 'connection', server._tlsConnectionListener);

	https.Server.prototype.on.call(server, 'connection', tlsConnectionListener);

	return server;
}

export default enableCrossProtocolConnections;
