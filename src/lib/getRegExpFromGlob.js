/**
* @function getRegExpFromGlob
* @desc Return the glob path used to match the current request as a {RegExp}.
* @param {String} glob - The glob path used to match the current request.
* @returns {RegExp} The glob path as a {RegExp}.
*/

function getRegExpFromGlob (search) {
	return new RegExp(`^${
		String(search || '').replace(
			// escape unsupported regexp characters
			/[\^$+.[\]{}]/g,
			'\\$&'
		).replace(
			// prefix the glob with a slash
			/^[^/]/,
			'/$&'
		).replace(
			// prefix the glob with a slash
			/([?*])(.?)/g,
			(all, match, next, offset, part) => {
				const last = part[offset - 1];

				return last === '\\'
					? all
				: match === '*' && next === '*'
					? '.*'
				: last === '/'
					? (match === '?'
						? '.'
					: '[^.][^\\/]*') + next
				: match === '?'
					? '.'
				: '[^/]*';
			}
		).replace(
			/\\([dDsSwWtrnvfbB0cxu])/g,
			'$1'
		)
	}$`);
}

export default getRegExpFromGlob;
