export default class CompositeDisposable {
	constructor (...args) {
		this.disposables = new Set();
		this.disposed = false;
		
		for (let disposable of args)
			this.disposables.add(disposable);
	}
	dispose () {
		if (this.disposed)
			return;
			
		for (let disposable of this.disposables)
			disposable.dispose();
		
		this.disposables = null;
		this.disposed = true;
	}
	add (...args) {
		if (this.disposed)
			return;
		
		for (let disposable of args)
			this.disposables.add(disposable);
	}
	remove (...args) {
		if (this.disposed)
			return;
			
		for (let disposable of args)
			this.disposables.delete(disposable);
	}
	clear () {
		if (this.disposed)
			return;
			
		this.disposables.clear();
	}
	[Symbol.iterator] () {
		return this.disposables.values();
	}
}