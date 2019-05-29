import { isFunction } from '../lib/is';
import https from 'https';
import map from '../lib/map';

/**
* Stops the server from accepting new connections.
* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
* @returns {Server}
*/

function close (callback) {
	// private data
	const data = map.get(this);

	Promise.all(
		data.servers.splice(0).map(
			server => new Promise(resolve => {
				server._events = server._originalEvents;

				https.Server.prototype.close.call(server, resolve);

				if (server._socket) {
					server._socket.end();
				}
			})
		)
	).then(
		servers => {
			if (servers.length) {
				https.Server.prototype.close.call(this);
			}

			data.listening = false;

			if (isFunction(callback)) {
				callback.call(this);
			}
		}
	);

	return this;
}

export default close;
