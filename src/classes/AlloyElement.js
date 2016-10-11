import EventEmitter from './EventEmitter';

class Alloy extends EventEmitter {
	
	constructor (element) {
		super();
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

	get children () {
		return this.element.children;
	}
	
	get parent () {
		return this.element.parentNode;
	}
	
	get firstChild () {
		return this.element.firstChild;
	}
	
	get lastChild () {
		return this.element.lastChild;
	}
	
	get previousSibling () {
		return this.element.previousSibling;
	}
	
	get nextSibling () {
		return this.element.nextSibling;
	}
	
	get style () {
		return this.element.style;
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

	setAttribute (...args) {
		return this.element.setAttribute(...args);
	}

	hasAttribute (...args) {
		return this.element.hasAttribute(...args);
	}

	getAttribute (...args) {
		return this.element.getAttribute(...args);
	}

	

	contains (...args) {
		return this.element.contains(...args);
	}
}

export default AlloyElement;