import { isString, isVoid } from '../lib/is';
import http from 'http';

export default function setHeader (name, value) {
	if (!this.finished && isString(name) && !isVoid(value)) {
		http.ServerResponse.prototype.setHeader.call(this, asHeaderName(name), value);
	}

	return this;
}

export function asHeaderName (name) {
	return /-/.test(name)
		? name
	: name.replace(
		/[\w][A-Z]/g,
		$0 => `${$0[0]}-${$0[1]}`
	).replace(
		/^[a-z]/,
		$0 => $0.toUpperCase()
	);
}
