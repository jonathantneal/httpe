import { isBuffer, isInteger, isJSON, isObject, isPromise, hasProperty, isStream } from '../lib/is';
import end from './end';

/**
* Send the HTTP response status, headers, and body, and end the response.
* @param {Number} [status=200] - The HTTP response status code.
* @param {Number} [headers] - The HTTP response headers.
* @param {Buffer|Promise|*} [body] - The HTTP response body.
* @returns {Server}
*/

export default function send (...args) {
	// get opts from [status][, headers][, body][, ...opts]
	const { body, ...opts } = Object.assign(getOptsFromSendArgs(args), {
		writeHead (data, opts) {
			return {
				...opts,
				headers: {
					'Content-Length': Buffer.byteLength(data),
					'Content-Type': isBuffer(data) || isStream(data)
						? 'application/octet-stream'
					: isJSON(data)
						? 'application/json; charset=utf-8'
					: 'text/html; charset=utf-8',
					...Object(opts.headers)
				}
			};
		}
	});

	end.call(this, body, opts);

	return this;
}

function getOptsFromSendArgs (args) {
	return args.reduce(
		(opts, arg) => {
			if (!hasProperty(opts, 'body')) {
				if (isPromise(arg) || isStream(arg)) {
					return { ...opts, body: arg };
				} else if (!hasProperty(opts, 'headers')) {
					if (isObject(arg)) {
						return { ...opts, headers: arg };
					} else if (!hasProperty(opts, 'status')) {
						if (isInteger(arg)) {
							return { ...opts, status: arg };
						}
					}
				}
			}

			return { ...opts, body: arg };
		},
		{}
	);
}
