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