import CompositeDisposable from "./CompositeDisposable"
import Disposable from "./Disposable"

export default class EventEmitter {
	constructor () {
		this.disposed = false;
		this.handlers = new Map();
	}
	on (eventName, callback) {
		if (this.disposed)
			return;
			
		let eventDisposable;
		if (eventName.includes(" ")) {
			eventDisposable = new CompositeDisposable();
			for (let name of eventName.split(" "))
				eventDisposable.add(this.on(name, callback));
				
		} else {
			let eventHandler = this.handlers.get(eventName);
			if (!eventHandler) {
				eventHandler = new Set();
				this.handlers.set(eventName, eventHandler);
			}
			eventDisposable = new Disposable(() => eventHandler.delete(callback));
			eventList.add(callback);
		}
		return eventDisposable;
	}
	once (eventName, callback) {
		if (this.disposed)
			return;
		let disposable = this.on(eventName, eventObject => {
			disposable.dispose();
			callback(eventObject);
		});
		return disposable;
	}
	emit (eventName, ...eventObjects) {
		if (this.disposed)
			return;
		let eventHandler = this.handlers.get(eventName);
		if (eventList) {
			for (let handler of eventList)
				handler(...eventObjects);
		}
	}
	dispose () {
		if (this.disposed)
			return;
		this.handlers = null;
		this.disposed = true;
	}
}