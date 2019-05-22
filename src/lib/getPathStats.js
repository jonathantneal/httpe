import fs from 'fs';
import mimeTypes from 'mime-types';
import p from 'path';

/**
* @private
* @name getPathStats
* @function
* @desc Returns the file stats for a given path.
* @param {String} path - The path used to get stats.
* @param {Object} [opts] - Additional configuration resolving file stats.
* @param {Object} [opts.cwd = '.'] - The directory used to resolve the path.
* @param {Object} [opts.index = 'index.html'] - The index basename used to resolve directories.
* @async
* @returns {Stats} A promise resolving with the matching path and file stats, or an error if it failed.
* @example
* httpe.getPathStats('/path/to/dir').then(stats => {
*   // get the resolved path
*   const isPathAFile = stats.path
*
*   // get whether the path is a file
*   const isPathAFile = stats.isFile()
*
*   // destructure additional custom stats
*   const { charset, contentLength, contentType, lastModified, mimeType, path } = stats
* })
*/

export default function getPathStats (path, opts) {
	const { cwd = '.', index = 'index.html' } = Object(opts);

	return new Promise((resolve, reject) => {
		path = p.resolve(cwd, path === '/' ? '' : path);

		fs.stat(path, (error, stats) => {
			if (error) {
				Object.assign(error, { path })

				reject(error);
			} else if (index && stats.isDirectory()) {
				path = p.resolve(path, index);

				getPathStats(path).then(resolve, reject);
			} else {
				const lastModified = new Date(stats.mtimeMs).toUTCString();
				const contentLength = stats.size;
				const mimeType = mimeTypes.lookup(path) || null;
				const charset = mimeTypes.charset(mimeType);
				const contentType = mimeTypes.contentType(mimeType) || null;

				Object.assign(stats, { charset, contentLength, contentType, lastModified, mimeType, path })

				resolve(stats);
			}
		});
	});
}
