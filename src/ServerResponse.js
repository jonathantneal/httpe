import end from './ServerResponse/end';
import http from 'http';
import redirect from './ServerResponse/redirect';
import send from './ServerResponse/send';
import sendFile from './ServerResponse/sendFile';
import sendType from './ServerResponse/sendType';
import setHeader from './ServerResponse/setHeader';
import setHeaders from './ServerResponse/setHeaders';
import setStatus from './ServerResponse/setStatus';
import setStatusMessage from './ServerResponse/setStatusMessage';
import write from './ServerResponse/write';
import writeHead from './ServerResponse/writeHead';

/**
* @name ServerResponse
* @class
* @extends http.ServerResponse
* @classdesc Creates the `response` object used to define server status, headers and data.
* @returns {ServerResponse}
* @example <caption>Using `ServerResponse` within a request event listener</caption>
* function onRequest (response, request) {
*   response.send('<p>some html</p>');
* }
*/

class ServerResponse extends http.ServerResponse {
	/**
	* Send the HTTP response status, headers, and body, and end the response.
	* This method signals to the server that all of the response headers and body have been sent; that server should consider this message complete. The method, response.end(), MUST be called on each response.
	* @param {Buffer|Promise|*} [data] - The HTTP response body.
	* @param {String} [encoding] - The character encoding of the data.
	* @param {Function} [callback] - The function called when the stream is finished.
	*/

	end (data, ...args) {
		return end.call(this, data, ...args);
	}

	/**
	* Redirects to a URL path, with a customizable status code. If not specified, status defaults to “302 “Found”.
	* @param {Number} [status=302] - The HTTP response status code.
	* @param {String} [path] - The URL path to redirect to.
	* @returns {Server}
	*/

	redirect (...args) {
		return redirect.call(this, ...args);
	}

	/**
	* Send the HTTP response status, headers, and body, and end the response.
	* @param {Number} [status=200] - The HTTP response status code.
	* @param {Number} [headers] - The HTTP response headers.
	* @param {Buffer|Promise|*} [body] - The HTTP response body.
	* @returns {Server}
	*/

	send (...args) {
		return send.call(this, ...args);
	}

	/**
	* Streams a local file from a given path. Sets `Content-Length`, `Content-Type`, `Date`, and `Last-Modified` headers.
	* @param {String} path - The path used to resolve the local file.
	* @param {Object} [opts] - Additional configuration resolving the local file.
	* @param {Object} [opts.from = '.'] - The directory used to resolve the local file.
	* @param {Object} [opts.index = 'index.html'] - The index basename used to resolve directories.
	* @param {Object} [opts.headers] - Additional HTTP response headers.
	* @param {Function} [opts.use] - The function used to process the local file.
	* @async
	* @returns {ServerResponse} A promise resolving with the current {@link ServerResponse} once the file has been streamed.
	*/

	sendFile (path, ...args) {
		return sendFile.call(this, path, ...args);
	}

	/**
	* Send the HTTP response body as CSS and end the response.
	* @param {Buffer|Promise|*} [css] - The HTTP response body sent as CSS.
	* @param {Object} [opts] - Additional configuration.
	* @param {Object} [opts.headers] - Additional configuration.
	* @param {Number} [opts.status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	sendCSS (css, opts) {
		return sendType.call(this, 'css', css, opts);
	}

	/**
	* Send the HTTP response body as HTML and end the response.
	* @param {String} [html] - The HTTP response body as HTML.
	* @param {Object} [opts] - Additional configuration.
	* @param {Object} [opts.headers] - Additional configuration.
	* @param {Number} [opts.status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	sendHTML (html, opts) {
		return sendType.call(this, 'html', html, opts);
	}

	/**
	* Send the HTTP response body as JavaScript and end the response.
	* @param {String} [js] - The HTTP response body as JavaScript.
	* @param {Object} [opts] - Additional configuration.
	* @param {Object} [opts.headers] - Additional configuration.
	* @param {Number} [opts.status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	sendJS (js, opts) {
		return sendType.call(this, 'js', js, opts);
	}

	/**
	* Send the HTTP response body as JSON and end the response.
	* @param {*} [json] - The HTTP response to be stringified as JSON.
	* @param {Object} [opts] - Additional configuration for stringification.
	* @param {Object} [opts.headers] - ...
	* @param {Function} [opts.replacer] - The function to customize the JSON stringification process.
	* @param {Number|String} [opts.space=2] - The white space used by the JSON stringification process.
	* @param {Number} [opts.status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	sendJSON (json, opts) {
		return sendType.call(this, 'json', json, opts);
	}

	/**
	* Send the HTTP response status, headers, and body as a specific content type, and end the response.
	* @param {Number} extension - The extension used to determine the content-type.
	* @param {Buffer|Promise|*} body - The HTTP response body.
	* @param {Object} [opts] - Additional configuration.
	* @param {Object} [opts.headers] - Additional HTTP response headers.
	* @param {Number} [opts.status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	sendType (extension, body, opts) {
		return sendType.call(this, extension, body, opts);
	}

	/**
	* Define a to-be-sent header.
	* @returns {Server}
	*/

	setHeader (name, value) {
		setHeader.call(this, name, value);

		return this;
	}

	/**
	* Define to-be-sent headers.
	* @returns {Server}
	*/

	setHeaders (...args) {
		return setHeaders.call(this, ...args);
	}

	/**
	* Set the HTTP status for the response.
	* @param {Number} [status=200] - The HTTP response status code.
	* @returns {Server}
	*/

	setStatus (status) {
		setStatus.call(this, status);

		return this;
	}

	/**
	* Set the status message for the response.
	* @param {String} [message] - The status message.
	* @returns {Server}
	*/

	setStatusMessage (status) {
		setStatusMessage.call(this, status);

		return this;
	}

	/**
	* Send the HTTP response status, headers, and body.
	* @param {Buffer|Promise|*} [data] - The HTTP response body.
	* @param {String} [encoding] - The character encoding of the data.
	* @param {Function} [callback] - The function called when the data is flushed.
	*/

	write (data, ...args) {
		return write.call(this, data, ...args);
	}

	/**
	* Sends a response header to the request.
	* @param {Number} status - The HTTP response status code.
	* @param {String} [statusMessage] - The status message sent to the client.
	* @param {Object} [headers] - Additional HTTP response headers.
	* @returns {Server}
	* @example
	* response.writeHead(200, {
	*  'Content-Length': 0,
	*  contentType: 'text/plain'
	* })
	*/

	writeHead (status, ...args) {
		return writeHead.call(this, status, ...args);
	}
}

export default ServerResponse;
