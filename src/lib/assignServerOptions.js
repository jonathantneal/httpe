import generateCertificate from '../generateCertificate';
import updateServerPort from './updateServerPort';

export default function assignServerOptions (server, options) {
	const isListenPort = typeof options.listen === 'number';

	// certificate options
	if ('cert' in options) {
		server.cert = options.cert;
	}

	if ('key' in options) {
		server.key = options.key;
	}

	if (!server.cert && !server.key) {
		const certificate = generateCertificate();

		Object.assign(server, certificate);
	}

	// IncomingMessage/ServerResponse options
	if ('IncomingMessage' in options) {
		server.IncomingMessage = options.IncomingMessage;
	}

	// ServerResponse option
	if ('ServerResponse' in options) {
		server.ServerResponse = options.ServerResponse;
	}

	// useAvailablePort option
	if (isListenPort || options.useAvailablePort) {
		server.useAvailablePort = true;
	}

	// port option
	if (isListenPort || options.useAvailablePort || ('port' in options)) {
		updateServerPort(
			server,
			isListenPort
				? options.listen
			: options.port
		);
	}
}
