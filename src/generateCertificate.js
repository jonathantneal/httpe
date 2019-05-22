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
	const props = Array.isArray(rawprops)
		? rawprops.reduce(
			(object, field) => field === Object(field)
				? Object.assign(object, {
					[field.name]: field.value
				})
			: object,
			{}
		)
	: rawprops === Object(rawprops)
		? rawprops
	: null;

	const attrs = props
		? Object.keys(props).map(name => ({
			name,
			value: props[name]
		}))
	: null;

	const opts = rawopts === Object(rawopts)
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
