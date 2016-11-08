import {
  requireInstance,
  requireType,
  isType
} from './util';

import getAlloyDefinition from './define';

const ATTRIBUTES = {
	children (children) {
		requireInstance(children, Array);
		for (let child of children) {
			create(child, this);
		}
	},
	events (events) {
		requireInstance(events, Object);
		for (let eventName in events) {
			this.addEventListener(eventName, events[eventName]);
		}
	},
	attributes (attributes) {
		requireInstance(attributes, Object);
		for (let attributeName in attributes) {
			this.setAttribute(attributeName, attributes[attributeName]);
		}
	},
	properties (properties) {
		requireInstance(properties, Object);
		for (let propertyName in properties) {
			this[propertyName] = properties[propertyName];
		}
	},
	template (str) {

	},
	text (str) {
		requireType(str, 'string');
		this.textContent = str;
	},
	html (str) {
		requireType(str, 'string');
		this.innerHTML = str;
	},
	style (str) {
		requireType(str, 'string');
		this.style.cssText = str;
	},
	class (str) {
		requireType(str, 'string');
		this.className = str;
	},
	ref (str) {
		requireType(str, 'string');
		
	}
};

function create(options, parent) {
	let element;
	if (isType(options, 'string')) {
		// if options was supplied as a string, use that as the tagName
		let alloy = getAlloyDefinition(tag);
		element = alloy ? alloy() : document.createElement(tag);
	} else {
		requireInstance(options, Object);
		const tag = options.tag;
		if (tag) {
			// search our definitions list for an alloy with that tag
			let alloy = getAlloyDefinition(tag);
			element = alloy ? alloy() : document.createElement(tag);
		} else {
			element = document.createElement('div');
		}
		
		for (let attribute in options) {
			if (ATTRIBUTES[attribute])
				ATTRIBUTES[attribute].apply(element, options[attribute]);
			else
				element[attribute] = options[attribute];
		}
	}
	// check for optional
	parent = parent || options.parent;

	parent && requireInstance(parent, HTMLElement) && parent.appendChild(element);

	return element;
}

export create;