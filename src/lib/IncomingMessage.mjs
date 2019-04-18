import { parse as parseAsURL, URLSearchParams } from 'url';
import getNormalizedRequestFromPath from './getNormalizedRequestFromPath';
import http from 'http';

export default class IncomingMessage extends http.IncomingMessage {
	constructor () {
		super(...arguments);

		Object.keys(parseAsURL(this.url)).forEach(name => {
			Object.defineProperty(this, name, {
				get () {
					return parseAsURL(this.url)[name];
				},
				set (newValue) {
					const urlObject = parseAsURL(this.url);

					urlObject[name] = newValue;

					this.url = urlObject.href;
				},
				configurable: true
			})
		});

		Object.defineProperty(this, 'searchParams', {
			get () {
				return new URLSearchParams(this.search);
			}
		});
	}

	match (path) {
		const [ method, port, glob ] = getNormalizedRequestFromPath(path);

		const match1 = !method || method === this.method;
		const match2 = match1 && (!port || port === this.connection.server.port);
		const match3 = match2 && (!glob || glob.test(this.pathname));

		return Boolean(match3);
	}
}
