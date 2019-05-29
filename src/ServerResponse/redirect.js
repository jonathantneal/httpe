import http from 'http';

export default function redirect () {
	if (!this.finished) {
		const args = Array.prototype.slice.call(arguments, 0, 2);
		const Location = String(args.pop());
		const status = Number(args.pop()) || 302;

		http.ServerResponse.prototype.writeHead.call(this, status, { Location });
		http.ServerResponse.prototype.end.call(this);
	}

	return this;
}
