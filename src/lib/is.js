export function hasProperty (value, prop) {
	return Object.hasOwnProperty.call(value, prop);
}

export function isArray (value) {
	return Array.isArray(value);
}

export function isBuffer (value) {
	return Buffer.isBuffer(value);
}

export function isFunction (value) {
	return typeof value === 'function';
}

export function isInteger (value) {
	return Number.isInteger(value);
}

export function isJSON (value) {
	return isObject(value) && !hasProperty(value, 'toString');
}

export function isObject (value) {
	return value === Object(value);
}

export function isPromise (value) {
	return typeof Object(value).then === 'function';
}

export function isStream (value) {
	return typeof Object(value).pipe === 'function';
}

export function isRegExp (value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}

export function isString (value) {
	return typeof value === 'string';
}

export function isVoid (value) {
	return value == null;
}
