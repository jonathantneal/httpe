import http from 'http';
import writer from '../lib/writer';

export default function end (data, ...args) {
	return writer.call(this, http.ServerResponse.prototype.end, data, ...args);
}
