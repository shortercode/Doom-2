import AlloyElement from './AlloyElement';

// Polyfill HTMLElement

if (!( 'remove' in HTMLElement.prototype)) {
	HTMLElement.prototype.remove = function remove () {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	}
}

if (!( 'insertAfter' in HTMLElement.prototype)) {
	HTMLElement.prototype.insertAfter = function insertAfter (newNode, referenceNode) {
		return this.insertBefore(newNode, referenceNode && referenceNode.nextSibling);
	}
}

// Retrofill HTMLElement, to allow it's method to accept instances of AlloyElement

const appendChild = HTMLElement.prototype.appendChild;
const removeChild = HTMLElement.prototype.removeChild;
const insertBefore = HTMLElement.prototype.insertBefore;
const insertAfter = HTMLElement.prototype.insertAfter;
const contains = HTMLElement.prototype.contains;

HTMLElement.prototype.appendChild = function appendChild (child) {
	if (child instanceof AlloyElement)
		child = child.element;
	return appendChild.call(this, child);
};

HTMLElement.prototype.removeChild = function removeChild (child) {
	if (child instanceof AlloyElement)
		child = child.element;
	return removeChild.call(this, child);
};

HTMLElement.prototype.insertBefore = function insertBefore (newNode, referenceNode) {
	if (newNode instanceof AlloyElement)
		newNode = newNode.element;
	if (referenceNode instanceof AlloyElement)
		referenceNode = referenceNode.element;
	return insertBefore.call(this, newNode, referenceNode);
};

HTMLElement.prototype.insertAfter = function insertAfter (newNode, referenceNode) {
	if (newNode instanceof AlloyElement)
		newNode = newNode.element;
	if (referenceNode instanceof AlloyElement)
		referenceNode = referenceNode.element;
	return insertAfter.call(this, newNode, referenceNode);
};

HTMLElement.prototype.contains = function contains (child) {
	if (child instanceof AlloyElement)
		child = child.element;
	return contains.call(this, child);
};