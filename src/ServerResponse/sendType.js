import end from './end';
import mimeTypes from 'mime-types';

export default function sendType (ext, data, opts) {
	end.call(this, data, {
		...Object(opts),
		writeHead (data, opts) {
			return {
				...opts,
				headers: {
					'Content-Length': Buffer.byteLength(data),
					'Content-Type': mimeTypes.lookup(ext),
					...Object(opts.headers)
				}
			};
		}
	});

	return this;
}
