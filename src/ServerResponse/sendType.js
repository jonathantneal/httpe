import end from './end';
import { byExt } from '../lib/mime';

// Send the HTTP response status, headers, and body as a specific content type, and end the response.
export default function sendType (ext, data, opts) {
	const db = byExt(ext)

	end.call(this, data, {
		...Object(opts),
		writeHead (data, opts) {
			return {
				...opts,
				headers: Object.assign(
					{ 'Content-Length': Buffer.byteLength(data) },
					db && { 'Content-Type': db.content },
					opts.headers
				)
			};
		}
	});

	return this;
}
