export default function setStatusMessage (statusMessage) {
	if (!this.finished) {
		this.statusMessage = String(statusMessage);
	}

	return this;
}
