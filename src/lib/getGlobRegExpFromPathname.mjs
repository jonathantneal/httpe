export default function getGlobRegExpFromPathname (pathname) {
	return new RegExp(`^${
		String(pathname || '').replace(
			// escape unsupported regexp characters
			/[\^$+.[\]{}]/g,
			'\\$&'
		).replace(
			// prefix the pathname with a slash
			/^[^/]/,
			'/$&'
		).replace(
			// prefix the pathname with a slash
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
