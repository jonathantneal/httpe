export default function tlsConnectionListener (socket) {
	const data = socket.read(1);

	if (data === null) {
		socket.removeListener('error', errorListener);
		socket.on('error', errorListener);

		socket.once('readable', () => {
			tlsConnectionListener.call(this, socket);
		});
	} else {
		socket.removeListener('error', errorListener);

		socket.unshift(data);

		if (data[0] === 22) {
			this._tlsConnectionListener(socket);
		} else {
			this._connectionListener(socket);
		}

		this._socket = socket;
	}
}

function errorListener () {}
