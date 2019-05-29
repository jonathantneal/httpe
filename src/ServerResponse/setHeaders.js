import { isObject } from '../lib/is';
import setHeader from './setHeader';

/**
* Define to-be-sent headers.
* @returns {Server}
*/

export default function setHeaders (headers, value) {
	if (isObject(headers)) {
		for (const name in headers) {
			setHeader.call(this, name, headers[name]);
		}

		return this;
	}

	return setHeader.call(this, headers, value);
}
