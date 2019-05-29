import { isArray, isObject } from './lib/is';
import { generate } from 'selfsigned';

/**
* @private
* @name generateCertificate
* @desc Generates a new SSL certificate.
* @param {Array|Object} props - A map of OID subject items.
* @param {Object} opts - Additional certificate configuration.
* @returns {Object} The certificate (`cert`) and private key (`key`).
*/

function generateCertificate (rawprops, rawopts) {
	const props = isArray(rawprops)
		? rawprops.reduce(
			(object, field) => isObject(field)
				? Object.assign(object, {
					[field.name]: field.value
				})
			: object,
			{}
		)
	: isObject(rawprops)
		? rawprops
	: null;

	const attrs = props
		? Object.keys(props).map(name => ({
			name,
			value: props[name]
		}))
	: null;

	const opts = isObject(rawopts)
		? rawopts
	: {
		extensions: [
			{
				name: 'subjectAltName',
				altNames: [{
					type: 2,
					value: 'localhost'
				}, {
					type: 7,
					ip: '127.0.0.1'
				}]
			}
		]
	};

	const { cert, private: key } = generate(attrs, opts);

	return { cert, key };
}

export default generateCertificate;
