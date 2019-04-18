import https from 'https';
import Server from './lib/Server';

export default {
	...https,
	createServer () {
		return new Server(...arguments);
	},
	Server
}
