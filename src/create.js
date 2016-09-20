const ATTRIBUTES = {
	children (children) {
		RequireInstance(children, Array);
		for (var i = 0, l = children.length; i < l; i++) {
			DOOM.create(children[i], this);
		}
	},
	events (events) {
		RequireInstance(events, Object);
		for (let eventName in events) {
			this.addEventListener(eventName, events[eventName], false);
		}
	},
	attributes (attributes) {
		RequireInstance(attributes, Object);
		for (let attributeName in attributes) {
			this.setAttribute(attributeName, attributes[attributeName]);
		}
	},
	properties (properties) {
		RequireInstance(properties, Object);
		for (let propertyName in properties) {
			this[propertyName] = properties[propertyName];
		}
	},
	template (str) {
		
	},
	text (str) {
		RequireType(str, 'string');
		this.textContent = str;
	},
	html (str) {
		RequireType(str, 'string');
		this.innerHTML = str;
	},
	style (str) {
		RequireType(str, 'string');
		this.style.cssText = str;
	},
	class (str) {
		RequireType(str, 'string');
		this.className = str;
	}
};

export default function create(options, parent) {
	let element;
	if (typeof options === 'string') {
		// if options was supplied as a string, use that as the tagName
		element = document.createElement(options);
	} else {
		RequireInstance(options, Object);
		let tag = options.tag;
		if (tag) {
			// search our definitions list for an alloy with that tag
			let alloy = DEFINITIONS.get(tag);
			element = alloy ? alloy() : document.createElement(tag);
		} else {
			element = document.createElement('div');
		}
		//
		for (var attribute in options) {
			if (ATTRIBUTES[attribute])
				ATTRIBUTES[attribute].apply(element, options[attribute]);
			else
				console.warn()
		}
	}
	// check for optional
	parent = parent || options.parent;

	parent && RequireElement(parent) && parent.appendChild(element)
	return element;
};