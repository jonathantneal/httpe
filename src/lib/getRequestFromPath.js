import { isArray, isObject, isRegExp, isString } from './is';
import getRegExpFromGlob from './getRegExpFromGlob';

/**
* @function getRequestFromPath
* @desc Returns the method, port, and path from a pattern used to match the current request.
* @param {RegExp|String} search - The pattern used to match the current request.
* @returns {Array} The method, port, and path.
*/

function getRequestFromPath (search) {
	let method, port, path;

	if (isString(search)) {
		const [, methodString = '', portString, pathString = '**'] = search.match(pathRegExp);

		method = formatMethod(methodString);
		port = formatPort(portString);
		path = getRegExpFromGlob(pathString);
	} else if (isRegExp(search)) {
		path = search;
	} else if (isObject(search)) {
		method = formatMethod(search.method);
		port = formatPort(search.port);
		path = getRequestFromPath(search.path)[2];
	}

	return [ method, port, path ];
}

function formatMethod (method) {
	return method ? (
		isArray(method)
			? method
		: String(method || '').split(/\|/)
	).map(
		part => part.toUpperCase()
	) : [];
}

function formatPort (port) {
	return port ? (
		isArray(port)
			? port
		: String(port || '').split(/\|/)
	).map(
		part => Number(part)
	) : [];
}

const pathRegExp = /^([A-z]+(?:\|[A-z]+)*)?\s*(?::(\d+(?:\|\d+)*))?\s*([\W][\W\w]*)?$/;

export default getRequestFromPath;
