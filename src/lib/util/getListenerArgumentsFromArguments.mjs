export default function getListenerArgumentsFromArguments (args) {
	const options = args.length === 0
		? {}
	: typeof args[0] === 'object' && args[0] !== null
		? args[0]
	: { port: args[0] };

	const callback = args[args.length - 1];

	return [ options, callback ];
}
