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
	
	set id (v) {
		this.element.id = v;
	}
	
	get class () {
		return this.element.classList;
	}
	
	get text () {
		return this.element.textContent;
	}
	
	set text (v) {
		this.element.textContent = v;
	}
	
	get html () {
		return this.element.innerHTML;
	}
	
	set html (v) {
		this.element.innerHTML = v;
	}
	
	get root () {
		let parent = null;
		let element = this.element;
		while (element.parentNode) {
			parent = element = element.parentNode;
		}
		return parent;
	}

	get children () {
		return this.element.children;
	}
	
	get parent () {
		return this.element.parentNode;
	}
	
	set parent (v) {
		v.appendChild(this.element);
	}
	
	get first () {
		return this.element.firstElementChild;
	}
	
	set first (v) {
		this.element.replaceChild(v, this.element.firstElementChild);
	}
	
	get last () {
		return this.element.lastElementChild;
	}
	
	set first (v) {
		this.element.replaceChild(v, this.element.lastElementChild);
	}
	
	get previous () {
		return this.element.previousElementSibling;
	}
	
	get next () {
		return this.element.nextElementSibling;
	}
	
	get style () {
		return this.element.style;
	}
	
	on (eventName, eventHandler, capture) {
		this.element.addEventListener(eventName, callback, capture);
	}
	
	off (eventName, eventHandler, capture) {
		this.element.removeEventListener(eventName, callback, capture);
	}
	
	once (eventName, eventMethod, capture) {
		let callback = (...args) => {
  			this.element.removeEventListener(eventName, callback, capture);
  			callback = null;
    		eventMethod(...args);
    	}
        this.element.addEventListener(eventName, callback, capture);
	}
	
	addEventListener (eventName, callback, capture) {
		this.element.addEventListener(eventName, callback, capture);
	}
	
	removeEventListener (eventName, callback, capture) {
		this.element.removeEventListener(eventName, callback, capture);
	}
	
	is (element) {
		return this.element === element;
	}
	
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

	contains (child) {
		return this.element.contains(child);
	}
	
	within (parent) {
		return parent.contains(this.element);
	}
	
	static for(element) {
		return ALLOY_LOOKUP.get(element);
	}
}

export default Alloy;