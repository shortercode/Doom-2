import { requireType, requireInstance } from './util';

const ALLOY_LOOKUP = new WeakMap();

class Alloy {

	constructor (element) {
		requireInstance(element, HTMLElement);
		// use define property to make the element value fixed
		Object.defineProperty(this, "element", {
			value: element,
			enumerable: false,
			writable: false,
			configurable: false
		});
		ALLOY_LOOKUP.set(element, this);
	}

	get id () {
		return this.element.id;
	}

	set id (id) {
		this.element.id = id;
	}

	get class () {
		return this.element.classList;
	}

	get text () {
		return this.element.textContent;
	}

	set text (textContent) {
		this.element.textContent = textContent;
	}

	get html () {
		return this.element.innerHTML;
	}

	set html (innerHTML) {
		this.element.innerHTML = innerHTML;
	}

	get root () {
		let parentNode = null;
		let element = this.element;
		while (element.parentNode) {
			parentNode = element = element.parentNode;
		}
		return parentNode;
	}

	get children () {
		return this.element.children;
	}

	get parent () {
		return this.element.parentNode;
	}

	set parent (parentNode) {
		parentNode.appendChild(this.element);
	}

	get firstChild () {
		return this.element.firstElementChild;
	}

	get lastChild () {
		return this.element.lastElementChild;
	}

	get previousSibling () {
		return this.element.previousElementSibling;
	}

	get nextSibling () {
		return this.element.nextElementSibling;
	}

	get style () {
		return this.element.style;
	}

	on (eventName, eventHandler, capture) {
		this.element.addEventListener(eventName, eventMethod, capture);
	}

	off (eventName, eventHandler, capture) {
		this.element.removeEventListener(eventName, callback, capture);
	}
	
	once (eventName, eventMethod, capture) {
		let callback = (...args) => {
  			this.element.removeEventListener(eventName, callback, capture);
  			callback = null;
    			eventMethod(...args);
    		};
      		this.element.addEventListener(eventName, callback, capture);
	}

	addEventListener (eventName, eventMethod, capture) {
		this.element.addEventListener(eventName, eventMethod, capture);
	}

	removeEventListener (eventName, eventMethod, capture) {
		this.element.removeEventListener(eventName, eventMethod, capture);
	}

	search (querySelector) {
		return this.element.querySelector(querySelector);
	}

	searchAll (querySelector) {
		return this.element.querySelectorAll(querySelector);
	}

	appendChild (newNode) {
		return this.element.appendChild(newNode);
	}

	removeChild (newNode) {
		return this.element.removeChild(newNode);
	}

	remove () {
		return this.element.remove();
	}

	insertBefore (newNode, referenceNode) {
		return this.element.insertBefore(newNode, referenceNode);
	}

	insertAfter (newNode, referenceNode) {
		return this.element.insertAfter(newNode, referenceNode);

	search (query) {
		return this.element.querySelector(query);
	}

	searchAll (query) {
		return this.element.querySelectorAll(query);
	}

	remove (child) {
		return this.element.removeChild(child);
	}

	insert (newNode, position, referenceNode) {
		
		if (!position)
			return this.element.appendChild(newNode);
		
		if (position === "after")
			referenceNode = referenceNode && referenceNode.nextSibling;
		else if (position !== "before")
			throw new Error(`${newNode} can only be inserted before or after ${referenceNode} not "${position}"`);
			
		return this.element.insertBefore(newNode, referenceNode);
	}

	set (name, value) {
		return this.element.setAttribute(name, value);
	}

	has (name) {
		return this.element.hasAttribute(name);
	}

	get (name) {
		return this.element.getAttribute(name);
	}
	
	delete (name) {
		return this.element.removeAttribute(name);
	}

	is (element) {
		return this.element === element;
	}

	contains (childNode) {
		return this.element.contains(childNode);
	}

	within (parentNode) {
		return parentNode.contains(this.element);
	}
	
	static for(element) {
		return ALLOY_LOOKUP.get(element);
	}
}

export default Alloy;
