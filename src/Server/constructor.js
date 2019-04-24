import allowCrossProtocolConnections from '../lib/allowCrossProtocolConnections';
import assignServerOptions from '../lib/assignServerOptions';
import IncomingMessage from '../IncomingMessage';
import ServerResponse from '../ServerResponse';

export default function constructor (server, args) {
	Object.assign(
		allowCrossProtocolConnections(server),
		{
			_servers: [],
			IncomingMessage,
			port: [80, 443],
			ServerResponse,
			useAvailablePort: false
		}
	);

	const requestListener = typeof args[args.length - 1] === 'function' && args.pop();

	// options argument
	const options = Object(args[0]);

	assignServerOptions(server, options);

	// listen option
	if (options.listen) {
		server.listen();
	}

	// requestListener argument
	if (typeof requestListener === 'function') {
		server.on('request', requestListener);
	}
}
