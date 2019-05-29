import { isInteger, isObject, isString } from '../lib/is';
import http from 'http';
import setHeaders from './setHeaders';
import setStatus from './setStatus';
import setStatusMessage from './setStatusMessage';

/**
* Send the response status and headers.
* @param {Number} status - The HTTP response status code.
* @param {String} [statusMessage] - The status message sent to the client.
* @param {Object} [headers] - Additional HTTP response headers.
* @returns {Server}
*/

export default function writeHead (...args) {
	// conditionally assign the status code, status message, and headers
	args.reduce(
		(args, arg) => {
			if (!(0 in args) && isInteger(arg)) {
				setStatus.call(this, args[0] = arg);
			} else if (!(1 in args) && isString(arg)) {
				setStatusMessage.call(this, args[1] = arg);
			} else if (!(2 in args) && isObject(arg)) {
				setHeaders.call(this, args[2] = arg);
			}
		},
		{}
	);

	// send the response head and return the response instance
	return http.ServerResponse.prototype.writeHead.call(this, this.statusCode);
}
