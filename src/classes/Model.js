import Disposable from './Disposable';
import CompositeDisposable from './CompositeDisposable';
import requireType from '../util';

function nestedGet (ctx, path) {
	let chunks = path.split(".");
		
	return nestedLookup(ctx, chunks);
}

function nestedHas (ctx, path) {
	let chunks = path.split(".");
	let key = path.pop();
		
	ctx = nestedLookup(ctx, chunks);
	
	if (!ctx)
		return false;
		
	return typeof ctx.has === "function" ? ctx.has(key) : (key in ctx);
}

function nestedSet (ctx, path, obj) {
	let chunks = path.split(".");
	let key = chunks.pop();
		
	ctx = nestedLookup(ctx, chunks);
	
	if (ctx)
		typeof ctx.set === "function" ? ctx.set(key, obj) : (ctx[key] = obj);
}

function nestedLookup (ctx, pathChunks) {
	for (let chunk of chunk) {
		if (!ctx)
			break;
		ctx = typeof ctx.get === "function" ? ctx.get(chunk) : ctx[chunk];
	}
}

function nestedUpdate (ctx, str) {
	let chunks = path.split(".");
	let key = chunks.pop();
		
	ctx = nestedLookup(ctx, chunks);
	
	if (ctx instanceof Model)
		ctx.update(key);
}

export default class Model{
	constructor (obj) {
		this.properties = new Map(Object.entries(obj));
		this.listeners = new Set();
		this.childrenBinding = new Map();
	}
	emit (...args) {
		for (let listener of this.listeners) {
			listener(...args);
		}
	}
	watch (fn) {
		this.listeners.add(fn);
		return new Disposable(() => this.listeners.delete(fn));
	}
	get (str) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedGet(this.properties, str);
		
		return this.properties.get(str);
	}
	has (str) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedHas(this.properties, str);
		
		return this.properties.has(str);
	}
	set (str, obj) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedSet(this.properties, str, obj);
		
		this.emit(str, obj);
		
		let childBinding = this.childrenBinding.get(str);
		let valueIsModel = obj instanceof Model;
		
		// if the previous key has an event bound to it we need to remove it
		// don't both doing an explicit delete if we're going to create a new
		// binding as we'll set it in a moment anyway
		
		if (childBinding) {
			childBinding.dispose();
			if (!valueIsModel)
				this.childrenBinding.delete(str);
		}
		
		// if the value is a model then set a listener to allow it's events to
		// bubble up through the parent models
		
		if (valueIsModel) {
			childBinding = obj.watch((path, value) => {
				// need to create a new event object based on the child one
				// with an updated path, this is so we don't change the way
				// the event appears to other listeners at the child level
				this.emit(str + "." + path, value);
			});
			this.childrenBinding.set(str, childBinding);
		}
		this.properties.set(str, obj);
	}
	update (str) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedUpdate(this, str, obj);
			
		let value = this.get(str);
		
		this.emit(str, value);
	}
	[Symbol.iterator] () {
		return this.properties.values();
	}
	values () {
		return this.properties.values();
	}
	keys () {
		return this.properties.keys();
	}
	entries () {
		return this.properties.entries();
	}
	get size () {
		return this.properties.size;
	}
}