import { AlloyElement } from "./classes/AlloyElement"

const DEFINITIONS = new Map();

export default function define(name, options) {
	RequireInstance(options, Object);
	RequireType(str, 'string');
	const tag = options.tagName || 'div';
	const creator = options.constructor;
	if (name.length < 1)
		throw "Invalid name"
	// check that it isn't already defined
	if (DEFINITIONS.has(name))
		return;
	// remove argument properties from the options prototype
	delete options.is;
	if (options.created)
		delete options.created;
	if (options.extends)
		delete options.extends;
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

function createAlloyConstructor (tagName, creator) {
	return class extends AlloyElement {
		constructor () {
			super(document.createElement(tagName));
			creator && creator.apply(this, arguments);
		}
	}
}

define("lemon", {
	tag: "canvas",
	constructor () {
		this.context = this.element.getContext('2d');
	}
});