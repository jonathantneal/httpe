import { isBuffer, isFunction, isJSON, isInteger, isObject, isPromise, isStream, isString, isVoid } from './is';
import setHeaders from '../ServerResponse/setHeaders';
import setStatus from '../ServerResponse/setStatus';
import setStatusMessage from '../ServerResponse/setStatusMessage';

export default function writer (httpWriter, data, ...args) {
	if (this.finished) {
		return false;
	}

	// get opts from [encoding][, callback][, opts]
	const opts = args.reduce(
		(opts, arg) => {
			if (!opts.encoding && isString(arg)) {
				opts.encoding = arg;
			} else if (!opts.callback && isFunction(arg)) {
				opts.callback = arg;
			} else if (isObject(arg)) {
				opts = { ...opts, ...arg };
			}

			return opts;
		},
		{}
	);

	const normalizedData = isStream(data)
		// get a promise to pipe a stream
		? new Promise((resolve, reject) => {
			setHead.call(this);

			data.on('open', () => {
				// when the readable stream is valid, pipe the read stream into the response
				data.pipe(this);
			}).on('error', error => {
				// when the readable stream catches an error, end the response with the error
				setStatus.call(this, 500);

				// reject the promise
				reject(error);
			}).on('end', () => {
				// resolve the promise with the result of the http writer
				resolve(runWriter.call(this));
			});
		})
	: isPromise(data)
		// get a promise to process resolved data
		? Promise.resolve(data).then(
			resolvedData => writer.call(this, httpWriter, resolvedData, ...args)
		)
	: isBuffer(data) || isVoid(data)
		// get buffers and void values
		? data
	: isJSON(data)
		// get stringified json
		? JSON.stringify(
			data,
			isFunction(opts.replacer) ? opts.replacer : null,
			isInteger(opts.space) || isString(opts.space) ? opts.space : 2
		)
	// otherwise, get a string
	: String(data);

	// return promises
	if (isPromise(normalizedData)) {
		return normalizedData;
	}

	setHead.call(this);

	// return the written response body
	return runWriter.call(this, normalizedData);

	function setHead () {
		if (isInteger(opts.status)) {
			setStatus.call(this, opts.status);
		}

		if (isString(opts.statusMessage)) {
			setStatusMessage.call(this, opts.statusMessage);
		}

		if (isObject(opts.headers)) {
			setHeaders.call(this, opts.headers);
		}
	}

	function runWriter (data) {
		return httpWriter.call(
			this,
			data,
			...[].concat(
				isString(opts.encoding) ? opts.encoding : [],
				isFunction(opts.callback) ? opts.callback : []
			)
		);
	}
}
