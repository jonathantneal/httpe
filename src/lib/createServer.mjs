import Server from './Server';

/**
* Returns a new instance of a Server.
*/

export default function createServer () {
	return new Server(...arguments);
}
