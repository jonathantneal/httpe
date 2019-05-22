import http from 'http';
import https from 'https';
import tlsConnectionListener from './tlsConnectionListener';

const { on, removeListener } = https.Server.prototype;
const { _connectionListener } = http;

/**
* @function enableCrossProtocolConnections
* @desc Enables cross protocol connections from the server.
* @param {Server} server - The current {@link Server}.
* @returns {Server}
*/

function enableCrossProtocolConnections (server) {
	Object.assign(server, {
		_connectionListener,
		_tlsConnectionListener: server._events.connection,
		allowHalfOpen: true,
		httpAllowHalfOpen: false,
		timeout: 2 * 60 * 1000
	});

	removeListener.call(server, 'connection', server._tlsConnectionListener);

	on.call(server, 'connection', tlsConnectionListener);

	return server;
}

export default enableCrossProtocolConnections;
