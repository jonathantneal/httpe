import allowCrossProtocolConnections from './util/allowCrossProtocolConnections';
import getListenerArgumentsFromArguments from './util/getListenerArgumentsFromArguments';
import https from 'https';
import IncomingMessage from './IncomingMessage';
import ServerResponse from './ServerResponse';

export default function listen () {
	const [ options, callback ] = getListenerArgumentsFromArguments(arguments);

	this.port = options.port || this.port;

	new Promise(
		resolve => this.close(resolve)
	).then(
		() => Promise.all(
			[].concat(this.port).map(
				port => new Promise(
					resolve => {
						const server = allowCrossProtocolConnections(
							new https.Server({
								...this,
								IncomingMessage,
								ServerResponse
							})
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

	if (typeof callback === 'function') {
		this.on('listening', callback);
	}

	return this;
}
