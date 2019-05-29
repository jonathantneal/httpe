import { hasProperty, isArray, isFunction, isObject } from '../lib/is';
import assignServerOptions from '../lib/assignServerOptions';
import enableCrossProtocolConnections from '../lib/enableCrossProtocolConnections';
import https from 'https';
import isPortAvailable from '../isPortAvailable'
import map from '../lib/map';

/**
* Starts a server listening for connections.
* @param {Function|Options|Port} [options] - The port used for connections, the options for the server, or the listener called once the server is bound.
* @param {Function} [listener] - The listener called once the server has been bound.
* @returns {Server}
*/

function listen (...args) {
	// private data
	const data = map.get(this);

	// listener argument
	const listeningListener = isFunction(args[args.length - 1]) && args.pop();

	if (isFunction(listeningListener)) {
		this.on('listening', listeningListener);
	}

	// options argument
	const options = args.length === 0
		? {}
	: isObject(args[0]) && !isArray(args[0])
		? args[0]
	: { port: args[0] };

	assignServerOptions(this, options);

	// configure servers
	const incomingPortHash = data.port.reduce((acc, port) => (acc[port] = port, acc), {});
	const existingPortHash = {};
	const closingServers = [];

	data.servers = data.servers.filter(
		existingServer => {
			if (hasProperty(incomingPortHash, existingServer.port)) {
				return existingPortHash[existingServer.port] = existingServer.port;
			} else {
				closingServers.push(
					new Promise(
						resolve => {
							existingServer._events = existingServer._originalEvents;

							https.Server.prototype.close.call(existingServer, resolve);

							if (existingServer._socket) {
								existingServer._socket.end();
							}
						}
					)
				);
			}
		}
	);

	const openingServers = [];

	data.port.forEach(
		port => {
			if (hasProperty(existingPortHash, port)) {
				// do nothing and continue
			} else {
				openingServers.push(
					new Promise(
						(resolve, reject) => {
							const server = Object.assign(
								enableCrossProtocolConnections(
									new https.Server(this)
								),
								{ port }
							);

							data.servers.push(server);

							https.Server.prototype.listen.call(
								server,
								{ ...options, port }
							).on('listening', () => {
								Object.assign(server, {
									_events: this._events,
									_originalEvents: server._events,
									port
								});

								resolve();
							}).on('error', error => {
								const serverIndex = data.servers.indexOf(server);

								if (serverIndex !== -1) {
									data.servers.splice(serverIndex, 1);
								}

								if (error.code === 'EADDRINUSE') {
									server.close(() => {
										reject({ port });
									});
								} else {
									reject(error);
								}
							})
						}
					)
				)
			}
		}
	);

	if (openingServers.length || closingServers.length) {
		Promise.all([
			...openingServers,
			...closingServers
		]).then(() => {
			// update data
			const serverPortHash = {};

			data.servers = data.servers.filter(server => server.listening && (serverPortHash[server.port] = true));
			data.port = data.port.filter(port => hasProperty(serverPortHash, port));

			if (data.port.length) {
				data.listening = true;

				this.emit('listening', this);
			}
		}, error => {
			// conditionally try again using an available port
			if (error.port && this.useAvailablePort) {
				isPortAvailable(error.port, true).then(nextPort => {
					listen.call(this, {
						...options,
						port: nextPort
					});
				});
			}
		});
	}

	return this;
}

export default listen;
