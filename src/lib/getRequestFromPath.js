import getRegExpFromGlob from './getRegExpFromGlob';

/**
* @function getRequestFromPath
* @desc Returns the method, port, and path from a pattern used to match the current request.
* @param {RegExp|String} search - The pattern used to match the current request.
* @return {Array} The method, port, and path.
*/

function getRequestFromPath (search) {
	let method, port, path;

	if (typeof search === 'string') {
		const [, methodString = '', portString, pathString = '**'] = search.match(pathRegExp);

		method = formatMethod(methodString);
		port = formatPort(portString);
		path = getRegExpFromGlob(pathString);
	} else if (Object.prototype.toString.call(search) === '[object RegExp]') {
		path = search;
	} else if (search === Object(search)) {
		method = formatMethod(search.method);
		port = formatPort(search.port);
		path = getRequestFromPath(search.path)[2];
	}

	return [ method, port, path ];
}

function formatMethod (method) {
	return method ? (
		Array.isArray(method)
			? method
		: String(method || '').split(/\|/)
	).map(
		part => part.toUpperCase()
	) : [];
}

function formatPort (port) {
	return port ? (
		Array.isArray(port)
			? port
		: String(port || '').split(/\|/)
	).map(
		part => Number(part)
	) : [];
}

const pathRegExp = /^([A-z]+(?:\|[A-z]+)*)?\s*(?::(\d+(?:\|\d+)*))?\s*([\W][\W\w]*)?$/;

export default getRequestFromPath;
