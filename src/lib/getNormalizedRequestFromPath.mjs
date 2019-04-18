import getGlobRegExpFromPathname from './getGlobRegExpFromPathname';

export default function getNormalizedRequestFromPath (path) {
	const [, methodCaseInsensitive = '', portString, pathname = '**'] = path.match(pathRegExp);
	const method = methodCaseInsensitive.toUpperCase();
	const glob = getGlobRegExpFromPathname(pathname);
	const port = Number(portString) || null;

	return [ method, port, glob ];
}

const pathRegExp = /^([A-z]+)?\s*(?::(\d+))?\s*([\W][\W\w]*)?$/;
