export default function getNormalizedPortFromArguments (args) {
	return Object(args[0]).port
		? typeof args[0].port === 'number'
			? args[0].port
		: args[0].port.map(
			port => Number(port)
		).filter(
			port => port
		)
	: [80, 443];
}
