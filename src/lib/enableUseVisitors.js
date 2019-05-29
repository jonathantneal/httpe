import https from 'https';
import map from './map';

/**
* @function enableUseVisitors
* @desc Enables visitor functions on requests to the server.
* @param {Server} server - The current {@link Server}.
* @returns {Server}
*/

export default function enableUseVisitors (server) {
	const uses = map.get(server).uses = [];

	https.Server.prototype.on.call(server, 'request', onRequest);

	function onRequest (request, response) {
		(request.response = response).request = request;

		return uses.reduce(
			(acc, use) => acc.then(
				() => {
					const shouldRunCallback = !response.finished && (
						!use.includes ||
						request.includes(use.includes)
					);

					if (shouldRunCallback) {
						return Promise.resolve(
							use.callback(request, response)
						).catch(
							error => {
								response.error = error;
							}
						);
					}
				}
			),
			Promise.resolve()
		);
	}
}
