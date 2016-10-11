import EventEmitter from './EventEmitter';
import requireType from '../util';

function nestedGet (ctx, path) {
	let chunks = path.split(".");
		
	for (let chunk of chunk) {
		if (!ctx)
			break;
		ctx = typeof ctx.get === "function" ? ctx.get(chunk) : ctx[chunk];
	}
	
	return ctx;
}

function nestedSet (ctx, path, obj) {
	let chunks = path.split(".");
	let key = chunks.pop();
		
	for (let chunk of chunk) {
		if (!ctx)
			break;
		ctx = typeof ctx.get === "function" ? ctx.get(chunk) : ctx[chunk];
	}
	
	if (ctx) {
		typeof ctx.set === "function" ? ctx.set(key, obj) : (ctx[key] = obj);
	}
}

function nestedUpdate (ctx, str) {
	let chunks = path.split(".");
	let key = chunks.pop();
		
	for (let chunk of chunk) {
		if (!ctx)
			break;
		ctx = ctx instanceof Model ? ctx.get(chunk) : null;
	}
	
	if (ctx instanceof Model) {
		ctx.update(key);
	}
}

class Model extends EventEmitter {
	constructor () {
		super();
		this.childrenBinding = new Map();
		this.properties = new Map();
	}
	get (str) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedGet(str);
		
		let value = this.properties.get(str)
		this.emit("get", {
			"type": "get",
			"path": str,
			"value": value,
			"target": this
		});
		
		return value;
	}
	set (str, obj) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedSet(str, obj);
		
		this.emit("set", {
			"type": "set",
			"path": str,
			"value": obj,
			"target": this
		});
		
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
			childBinding = obj.on("set get", e => {
				// need to create a new event object based on the child one
				// with an updated path, this is so we don't change the way
				// the event appears to other listeners at the child level
				this.emit(e.type, {
					"type": e.type,
					"path": str + "." + e.path,
					"value": e.value,
					"target": e.target
				});
			});
			this.childrenBinding.set(str, childBinding);
		}
		this.properties.set(str, obj);
	}
	update (str) {
		requireType(str, "string");
		
		if (str.includes("."))
			return nestedUpdate(str, obj);
			
		let value = this.get(str);
		
		this.emit("set", {
			"type": "set",
			"path": str,
			"value": value,
			"target": this
		});
	}
}