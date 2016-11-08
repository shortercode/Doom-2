import { AlloyElement } from "./classes/AlloyElement"

const DEFINITIONS = new Map();

export function define(name, constructor) {
	RequireInstance(constructor, Function);
	RequireType(str, 'string');
	const tag = options.tag || 'div';
	const creator = options.constructor;
	if (name.length < 1)
		throw "Invalid name"
	// check that it isn't already defined
	if (DEFINITIONS.has(name))
		return;
	// remove argument properties from the options prototype
	delete options.tag;
	if (options.constructor)
		delete options.constructor;
	// create the inherited constructor
	var constructor = createAlloyConstructor(tag, createdCallback);
	constructor.name = name;
	constructor.prototype = Object.create(Alloy.prototype);
	assign(constructor.prototype, options);
	// set the constructor on the prototype
	constructor.prototype.constructor = constructor;

	// statically append the extension to the constructor
	constructor.extends = tag;
	// save the definition
	DEFINITIONS.set(name, constructor);
}

export function getAlloyDefinition(name) {
  return DEFINITIONS.get(name);
}

function createAlloyConstructor (tagName, creator) {
	return class extends AlloyElement {
		constructor () {
			super(document.createElement(tagName));
			creator && creator.apply(this, arguments);
		}
	}
}

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
function create(name) {
	const method = DEFINITIONS.get(name);
	return new method();
}

define("alloy-button", class FancyButton extends alloy('button') {
	constructor() {
		super(); // always call super() first in the ctor.
		this.addEventListener('click', e => this.drawRipple(e.offsetX, e.offsetY));
	}

	// Material design ripple animation.
	drawRipple(x, y) {
		let div = document.createElement('div');
		div.classList.add('ripple');
		this.appendChild(div);
		div.style.top = `${y - div.clientHeight / 2}px`;
		div.style.left = `${x - div.clientWidth / 2}px`;
		div.style.backgroundColor = 'currentColor';
		div.classList.add('run');
		div.addEventListener('transitionend', e => div.remove());
	}
});