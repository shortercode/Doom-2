import AlloyElement from "./classes/AlloyElement"

const DEFINITIONS = new Map();
const EXTENDABLE_ALLOYS = new Map();

function define(name, create) {
	
	RequireInstance(create, Function);
	RequireType(name, 'string');
	
	if (!(create.prototype.instanceof AlloyElement))
		throw new TypeError(`${create} does not extend ${AlloyElement}`);
	
	if (!name.includes("-"))
		throw new Error(`Failed to define "${name}" in DOOM element registry. AlloyElement names must include a "-"`);
	
	if (DEFINITIONS.has(name))
		throw new Error(`Failed to define "${name}" in DOOM element registry. "${name}" is already defined in the registry`);
		
	DEFINITIONS.set(name, create);
	EXTENDABLE_ALLOYS.set(name, create);
}

function alloy(name) {
	let newAlloy = EXTENDABLE_ALLOYS.get(name);
	if (!newAlloy) {
		newAlloy = class NativeAlloyElement extends AlloyElement (name) {
			constructor () {
				super(document.createElement(name));
			}
			static get extends () {
				return name;
			}
		};
		EXTENDABLE_ALLOYS.set(name, newAlloy);
	}
	return newAlloy;
}

function getAlloyDefinition(name) {
  return DEFINITIONS.get(name);
}

export { getAlloyDefinition, define, alloy };
/*
// the wall mk2, much smaller
const DEFINITIONS = new Map();
const NATIVE_CLASSES = new Map();
function getNativeClass (name) {
	let nativeClass = NATIVE_CLASSES.get(name);
	if (!nativeClass) {
		const tempElement = document.createElement(name);
		nativeClass = tempElement.constructor;
		NATIVE_CLASSES.set(name, nativeClass);
	}
	return nativeClass;
}
function define(name, method) {
	window.customElements.define(name, method, {extends: method.extends});
	DEFINITIONS.set(name, method);
	return method;
}
function alloy(name) {
	let newAlloy = DEFINITIONS.get(name);
	if (!newAlloy) {
		newAlloy = class AlloyElement extends getNativeClass(name) {
			constructor () {
				super();
				this.eventHandlers = new Map();
			}
			on (name, method) {
				this.eventHandlers.set(name, method);
			}
			fire (name, obj) {
				const handler = this.eventHandlers.get(name);
				handler && handler(obj);
			}
			static get extends () {
				return name;
			}
		};
		DEFINITIONS.set(name, newAlloy);
	}
	return newAlloy;
}
*/