import getGlobRegExpFromPathname from './getGlobRegExpFromPathname';

export default function getRequestFromPath (search) {
	let method, port, path;

	if (typeof search === 'string') {
		const [, methodString = '', portString, pathString = '**'] = search.match(pathRegExp);
		method = formatMethod(methodString);
		port = formatPort(portString);
		path = getGlobRegExpFromPathname(pathString);
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
	return (
		Array.isArray(method)
			? method
		: String(method || '').split(/\|/)
	).map(
		part => part.toUpperCase()
	);
}

function formatPort (port) {
	return (
		Array.isArray(port)
			? port
		: String(port || '').split(/\|/)
	).map(
		part => Number(part)
	);
}

const pathRegExp = /^([A-z]+(?:\|[A-z]+)*)?\s*(?::(\d+(?:\|\d+)*))?\s*([\W][\W\w]*)?$/;
