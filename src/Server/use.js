import map from '../lib/map';

export default function use (callback) {
	const { uses } = map.get(this);

	if (arguments.length > 1) {
		const [includes, callback] = arguments;

		uses.push({ includes, callback });
	} else {
		uses.push({ callback });
	}

	return this;
}
