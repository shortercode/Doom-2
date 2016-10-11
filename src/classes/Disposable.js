export class Disposable {
	/*
		Creates a disposable with a given dispose action and an optional argument to pass the dispose action
	*/
	constructor (action) {
		this.disposeAction = action;
		this.disposed = false;
	}
	/*
		Triggers the dispose state if not already in it
		This is non-reversable, and the instance should be dereferenced after this
	*/
	dispose () {
		if (!this.disposed) {
			this.disposed = true;
			this.disposeAction && this.disposeAction();
			this.disposeAction = null;
		}
	}
	/*
		Creates a new disposable based on a native event dispatcher
		
		Example:
		
		let loadEventDisposable = Disposable.from(window, 'load', () => {
			console.log("did load");
			loadEventDisposable.dispose();
			loadEventDisposable = null;
		});
	*/
	static from (eventSource, eventName, callback, capture) {
		eventSource.addEventListener(eventName, callback, capture);
		return new Disposable(() => eventSource.removeEventListener(eventName, callback, capture));
	}
}