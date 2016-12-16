const SELF = "element";

function createProxyElement(tag) {
	const ctor = getNativeClass(tag);
	
	const method = function Proxy (...args) {
		this[SELF] = document.createElement(tag);
	}
	const proto = {};
	
	const propertyDescriptors = listProps(ctor);
	
	for (let [label, descriptor] of Object.entries(propertyDescriptors)) {
		if ("value" in descriptor && typeof descriptor === "function") {
			Object.defineProperty(proto, label, {
				configurable: descriptor.configurable,
				enumerable: descriptor.enumerable,
				writable: descriptor.writable,
				value: bindDynamicContext(descriptor.value)
			});
		} else {
			const get = "get" in descriptor || "value" in descriptor;
			const set = "set" in descriptor || "value" in descriptor;
			
			Object.defineProperty(proto, label, {
				configurable: descriptor.configurable,
				enumerable: descriptor.enumerable,
				get: get && bindDynamicGetter(label),
				set: set && bindDynamicSetter(label)
			})
		}
	}
	
	method.prototype = proto;
	
	return method;
}

function getNativeClass (name) {
	const tempElement = document.createElement(name);
	return tempElement.constructor;
}

function bindDynamicFunction(fn) {
	return function () {
		return fn.apply(this[SELF], arguments);
	}
}

function bindDynamicGetter(value) {
	return function (v) {
		return this[SELF][value];
	}
}

function bindDynamicSetter(value) {
	return function (v) {
		this[SELF][value] = v;
	}
}

function listProps (obj) {
	let proto = obj.prototype;
	let props = {};
	while (proto !== Object.prototype) {
		props = Object.assign(Object.getOwnPropertyDescriptors(proto), props); // props should be appended to the new proto, as we are working DOWN the inheritance chain
		proto = Object.getPrototypeOf(proto);
	}
	return props;
}