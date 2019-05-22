/**
* @function tlsConnectionListener
* @desc A rewired connection listener for HTTP and HTTPS.
* @param {Socket} socket - The TCP socket.
* @returns {Void}
*/

function tlsConnectionListener (socket) {
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

export default tlsConnectionListener;
