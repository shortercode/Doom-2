import EventEmitter from './EventEmitter';
import { requireType, requireInstance } from './util';

const EVENT_METHODS = new Map();

class Alloy {
	
	constructor (element) {
		requireInstance(element, HTMLElement);
		this.element = element;
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
	
	get firstChild () {
		return this.element.firstElementChild;
	}
	
	set firstChild (v) {
		this.element.replaceChild(v, this.element.firstElementChild);
	}
	
	get lastChild () {
		return this.element.lastElementChild;
	}
	
	set firstChild (v) {
		this.element.replaceChild(v, this.element.lastElementChild);
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
		this.element.addEventListener(eventName, callback, capture);
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
	
	search (...args) {
		return this.element.querySelector(...args);
	}

	searchAll (...args) {
		return this.element.querySelectorAll(...args);
	}

	appendChild (...args) {
		return this.element.appendChild(...args);
	}
	
	removeChild (...args) {
		return this.element.removeChild(...args);
	}

	remove (...args) {
		return this.element.remove(...args);
	}

	insertBefore (...args) {
		return this.element.insertBefore(...args);
	}

	insertAfter (...args) {
		return this.element.insertAfter(...args);
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

	contains (child) {
		return this.element.contains(child);
	}
	
	within (parent) {
		return parent.contains(this.element);
	}
}

export default AlloyElement;