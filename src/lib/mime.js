import dbByContent from 'mime-db';

// returns a file extension as [1] or returns null
const extMatch = /^[^?#]*[^/.]\.([^.?#]+)([.?#][\W\w]*)?$/;
const extMatchNoop = ['', ''];

// returns { ext: { charset, compressible, mime, source }, etc }
const dbByExtension = Object.keys(dbByContent).reduce((dbByExtension, mime) => {
	const db = dbByContent[mime];

	db.extensions && db.extensions.forEach(extension => {
		const dByExtension = { ...dbByContent[mime], mime };
		delete dByExtension.extensions;

		dbByExtension[extension] = dByExtension;
	})

	return dbByExtension;
}, {});

export const byContent = content => dbByContent[content] || null;
export const byExt = ext => dbByExtension[ext] || null;
export const byPath = path => dbByExtension[(path.match(extMatch) || extMatchNoop)[1]] || null;
export const charsetByPath = path => Object(byPath(path)).charset || null;
export const contentByPath = (path, charset) => {
	const data = byPath(path);

	return data ? `${data.mime}${data.charset || charset ? `; ${String(data.charset || charset).toLowerCase()}` : ''}` : null;
};
export const mimeByPath = path => Object(byPath(path)).mime || null;
