import https from 'https';

export default function close (callback) {
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

	return this;
}
