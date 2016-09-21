const WHITE_SPACE_REGEX = /^\s*$/;

function cleanNode (parentNode) {
	const childNodes = Array.prototype.slice.call(parentNode);
	for (let child of childNodes) {
		if (child.nodeType === Node.TEXT_NODE && WHITE_SPACE_REGEX.test(child.textContent))
			parentNode.removeChild(child);
		else if (child.hasChildNodes())
			cleanNode(child);
	}
}

export function reduce (element) {
	if (!(element instanceof HTMLElement))
		throw new TypeError(`Failed to execute 'cleanElement' parameter 1 is not of type 'HTMLElement'`);
	element.normalize(); // removes completely empty text nodes and joins adjascent text nodes ( minimise our work )
	cleanNode(element);
}