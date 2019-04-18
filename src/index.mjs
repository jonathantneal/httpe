import createServer from './lib/createServer';
import https from 'https';
import IncomingMessage from './lib/IncomingMessage';
import Server from './lib/Server';
import ServerResponse from './lib/ServerResponse';

export default {
	...https,
	createServer,
	IncomingMessage,
	Server,
	ServerResponse
}
