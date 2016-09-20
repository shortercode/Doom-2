const NATIVEPROPERTIES = [
	'id',
	'children',
	'childNodes',
	'parentNode',
	'firstChild',
	'previousSibling',
	'nextSibling',
	'nodeName',
	'className',
	'classList',
	'lastChild',
	'style',
	'textContent',
	'innerHTML'
];

const NATIVEMETHODS = [
	'querySelector',
	'querySelectorAll',
	'appendChild',
	'setAttribute',
	'hasAttribute',
	'getAttribute',
	'removeChild',
	'remove',
	'insertBefore',
	'insertAfter',
	'addEventListener',
	'removeEventListener',
	'contains'
];

const PROTOTYPE = {
	
};

// Polyfill HTMLElement
{
	polyfill(HTMLElement.prototype, 'remove', function remove() {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	});
	polyfill(HTMLElement.prototype, 'insertAfter', function insertAfter() {
		return this.insertBefore(newNode, referenceNode && referenceNode.nextSibling);
	});
	
}

function AlloyElement (element) {
	if (!(this instanceof Alloy))
		throw new TypeError(`Class constructor Alloy cannot be invoked without 'new'`);
	this.element = element;
}

for (let property of NATIVEPROPERTIES) {
	Object.defineProperty(PROTOTYPE, property, {
		get () {
			return this.element[property];
		},
		set (v) {
			this.element[property] = v;
		}
	});
}

for (let method of NATIVEMETHODS) {
	Object.defineProperty(PROTOTYPE, method, {
		value () {
			return this.element[method].apply(this.element, arguments);
		}
	});
}

AlloyElement.prototype = PROTOTYPE;

export default AlloyElement;