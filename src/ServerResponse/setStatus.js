export default function setStatus (status) {
	if (!this.finished) {
		this.statusCode = Number(status) || 200;
	}

	return this;
}
