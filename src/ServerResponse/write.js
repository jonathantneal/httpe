import http from 'http';
import writer from '../lib/writer';

export default function write (data, ...args) {
	return writer.call(this, http.ServerResponse.prototype.write, data, ...args);
}
