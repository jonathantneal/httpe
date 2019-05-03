import https from 'https';

/**
* Stops the server from accepting new connections.
* @param {Function} [closeListener] - The method called when all of the servers have been unbound.
* @return {Server}
*/

function close (callback) {
	Promise.all(
		this._servers.splice(0).map(
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

			if (typeof callback === 'function') {
				callback.call(this);
			}
		}
	);
}

export default close;
