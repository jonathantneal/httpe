import allowCrossProtocolConnections from '../lib/allowCrossProtocolConnections';
import assignServerOptions from '../lib/assignServerOptions';
import IncomingMessage from '../IncomingMessage';
import ServerResponse from '../ServerResponse';

export default function constructor (...args) {
	Object.assign(
		allowCrossProtocolConnections(this),
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

	assignServerOptions(this, options);

	// listen option
	if (options.listen) {
		this.listen();
	}

	// requestListener argument
	if (typeof requestListener === 'function') {
		this.on('request', requestListener);
	}
}
