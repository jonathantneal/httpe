import enableCrossProtocolConnections from '../lib/enableCrossProtocolConnections';
import assignServerOptions from '../lib/assignServerOptions';
import https from 'https';

/**
* Starts a server listening for connections.
* @param {Function|Options|Port} [options] - The port used for connections, the options for the server, or the listener called once the server is bound.
* @param {Function} [listener] - The listener called once the server has been bound.
* @return {Server}
*/

function listen (...args) {
	// listener argument
	const listeningListener = typeof args[args.length - 1] === 'function' && args.pop();

	// options argument
	const options = args.length === 0
		? {}
	: args[0] === Object(args[0])
		? args[0]
	: { port: args[0] };

	assignServerOptions(this, options);

	Promise.resolve(this.port).then(
		() => new Promise(
			resolve => this.close(resolve)
		)
	).then(
		() => Promise.all(
			[].concat(this.port).map(
				port => new Promise(
					resolve => {
						const server = enableCrossProtocolConnections(
							new https.Server(this)
						);

						https.Server.prototype.listen.call(
							server,
							{ ...options, port },
							() => {
								resolve(
									Object.assign(server, {
										_events: this._events,
										_originalEvents: server._events,
										port
									})
								);
							}
						);
					}
				)
			)
		)
	).then(
		servers => {
			this._servers.splice(this._servers.length, 0, ...servers);

			this.emit('listening');
		}
	);

	if (typeof listeningListener === 'function') {
		this.on('listening', listeningListener);
	}
}

export default listen;
