export default class Disposable {
	constructor (action) {
		this.disposeAction = action;
		this.disposed = false;
	}
	dispose () {
		if (this.disposed)
			return;
			
		this.disposed = true;
		this.disposeAction && this.disposeAction();
		this.disposeAction = null;
	}
	static from (eventSource, eventName, callback, capture) {
		let attach = eventSource.on || eventSource.addEventListener;
		let detach = eventSource.off || eventSource.removeEventListener;
		
		attach(eventName, callback, capture);
		return new Disposable(() => detach(eventName, callback, capture));
	}
}