import CompositeDisposable from "./CompositeDisposable"
import Disposable from "./Disposable"

export class EventEmitter {
	constructor () {
		this.disposed = false;
		this.eventMap = new Map();
		this.disposable = new CompositeDisposable();
	}
	on (eventName, callback) {
		if (!this.disposed) {
			let eventDisposable;
			
			if (eventName.includes(" ")) {
				
				let eventDisposable = new CompositeDisposable();
				for (let name of eventName.split(" ")) {
					eventDisposable.add(this.on(name, callback));
				}
				
			} else {
				
				let eventList = this.eventMap.get(eventName);
				if (!eventList) {
					eventList = new Set();
					this.eventMap.set(eventName, eventList);
				}
				eventDisposable = new Disposable(() => eventList.delete(callback));
				eventList.add(callback);
				this.disposable.add(eventDisposable);
				
			}
			
			return eventDisposable;
		}
	}
	once (eventName, callback) {
		const disposable = this.on(eventName, eventObject => {
			disposable.dispose();
			callback(eventObject);
		});
		return disposable;
	}
	emit (eventName, ...eventObjects) {
		if (!this.disposed) {
			const eventList = this.eventMap.get(eventName);
			if (eventList) {
				for (let handler of eventList) {
					handler(...eventObjects);
				}
			}
		}
	}
	dispose () {
		if (!this.disposed) {
			this.disposable.dispose();
			this.disposable = null;
			this.eventMap.clear();
			this.eventMap = null;
			this.disposed = true;
		}
	}
}