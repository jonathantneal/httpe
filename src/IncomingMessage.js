import { parse as parseAsURL, URLSearchParams } from 'url';
import getRequestFromPath from './lib/getRequestFromPath';
import http from 'http';
import mimeTypes from 'mime-types';

/**
* @name IncomingMessage
* @class
* @extends http.IncomingMessage
* @classdesc Creates the `request` object used to access client status, headers and data.
* @return {IncomingMessage}
*/

class IncomingMessage extends http.IncomingMessage {
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

	/**
	* Returns whether the current request matches a particular pattern.
	* @param {Object|String|RegExp} pattern - The pattern used to match the current request.
	* @returns {Boolean} Whether the pattern matched the current request.
	* @example <caption>Match any path name that ends in .js</caption>
	* request.includes('**.js');
	* request.includes(/\.js$/);
	* request.includes({ path: '**.js' });
	* request.includes({ path: /\.js$/ });
	* @example <caption>Match any GET or POST request on port 80 or 443 that ends in .js</caption>
	* request.includes('GET|POST:80|443 **.js');
	* request.includes({ method: 'GET|POST', port: '80|443', path: '**.js' });
	* request.includes({ method: ['GET', 'POST'], port: [80, 443], path: /\.js$/ });
	*/

	includes (search) {
		const [ method, port, path ] = getRequestFromPath(search);

		const match1 = !method.length || method.includes(this.method);
		const match2 = match1 && (!port.length || port.includes(this.connection.server.port));
		const match3 = match2 && (!path || path.test(this.pathname));

		return Boolean(match3);
	}

	/**
	* Returns the default charset for the current URL.
	* @returns {String|Null}
	* @example <caption>If the request.pathname is `/script.js`</caption>
	* request.charset; // returns 'UTF-8'
	*/

	get charset () {
		return mimeTypes.charset(mimeTypes.lookup(this.pathname)) || null;
	}

	/**
	* Returns the default content type for the current URL.
	* @returns {String|Null}
	* @example <caption>If the request.pathname is `/script.js`</caption>
	* request.contentType; // returns 'application/javascript; charset=utf-8'
	*/

	get contentType () {
		return mimeTypes.contentType(this.mimeType) || null;
	}

	/**
	* Returns the default mime type for the current URL.
	* @returns {String|Null}
	* @example <caption>If the request.pathname is `/script.js`</caption>
	* request.mimeType; // returns 'application/javascript'
	*/

	get mimeType () {
		return mimeTypes.lookup(this.pathname) || null;
	}
}

export default IncomingMessage;
