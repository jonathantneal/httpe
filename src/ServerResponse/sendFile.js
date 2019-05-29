import { hasProperty, isFunction } from '../lib/is';
import end from './end';
import fs from 'fs';
import getPathStats from '../getPathStats';

export default function sendFile (path, ...args) {
	const opts = Object(args[0])

	return getPathStats(path, opts).then(
		stats => {
			const headers = {
				contentLength: stats.contentLength,
				contentType: stats.contentType,
				lastModified: stats.lastModified,
				...Object(opts.headers)
			};

			if (stats.lastModified === this.request.headers['if-modified-since']) {
				return end.call(this, null, {
					status: 304,
					headers
				});
			}

			if (isFunction(opts.use)) {
				return new Promise((resolve, reject) => {
					fs.readFile(stats.path, 'utf8', (error, data) => {
						if (error) {
							reject(error);
						} else {
							resolve(data);
						}
					});
				}).then(
					data => opts.use.call(this, data, stats)
				).then(returnValue => {
					const body = String(
						hasProperty(Object(returnValue), 'body')
							? returnValue.body
						: returnValue
					);

					return end.call(this, body, {
						status: 200,
						headers: {
							...headers,
							...Object(Object(returnValue).headers)
						}
					});
				});
			}

			return end.call(this, fs.createReadStream(stats.path), {
				status: 200,
				headers
			});
		},
		error => {
			throw error;
		}
	);
}
