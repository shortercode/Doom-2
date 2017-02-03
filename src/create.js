import {
  requireInstance,
  requireType,
  isType
} from './util';
import getAlloyDefinition from './define';

let referenceStack = [];
let scopeStack = [];

// the attribute list specifies methods that can be parameters in the create call
const ATTRIBUTES = {
  children(children) {
    requireInstance(children, Array);
    for (let child of children) {
      create(child, this);
    }
  },
  on(events) {
    requireInstance(events, Object);
    for (let eventName in events) {
      this.addEventListener(eventName, events[eventName]);
    }
  },
  once(events) {
	requireInstance(events, Object);
    for (let eventName in events) {
	  let callback = (...args) => {
		this.removeEventListener(eventName, callback);
		callback = null;
  		events[eventName](...args);
  	  }
      this.addEventListener(eventName, callback);
    }
  },
  attributes(attributes) {
    requireInstance(attributes, Object);
    for (let attributeName in attributes) {
      this.setAttribute(attributeName, attributes[attributeName]);
    }
  },
  // template(str) {
  //   requireType(str, 'string');
  //   if (!scopeStack[0])
  //     throw new Error("No scope defined for template \"" + str + "\"");
  //   new Template(this, scopeStack[0], str);
  // },
  text(str) {
    requireType(str, 'string');
    this.textContent = str;
  },
  html(str) {
    requireType(str, 'string');
    this.innerHTML = str;
  },
  style(str) {
    requireType(str, 'string');
    this.style.cssText = str;
  },
  class(str) {
    requireType(str, 'string');
    this.className = str;
  },
  ref(label) {
    requireType(label, 'string');
    if (!referenceStack[0])
      throw new Error("No reference map defined for \"" + label + "\"");
    if (referenceStack[0][label])
      throw new Error("Label \"" + label + "\" already defined for reference map");
    referenceStack[0][label] = this;
  }
};

const IGNORE_ATTRIBUTES = new Set([
  "delay",
  "tag",
  "dictionary",
  "scope",
  "parent"
]);

function create(options, parent) {
  let element;
  // if options was supplied as a string, use that as the tagName
  if (isType(options, 'string')) {
    let alloy = getAlloyDefinition(tag);
    element = alloy ? alloy() : document.createElement(tag);
  // else options must be an parameter object
  } else {
    requireInstance(options, Object);
	const delay = options["delay"];
	// attempt to remove the delay property, so after the timer it isn't repeated
	options["delay"] = null;
	// if a delay is specified we should set a timer and bail immediately
	if (delay)
	  return wait(delay, create, options, parent);
	// store values that are not applied via an attribute
    const tag = options["tag"] || 'div';
    const ref = options["dictionary"];
    const scope = options["scope"];
	// if provided with a parent parameter override the argument value
	// normally only one will be defined
	if (options[parent])
		parent = options["parent"];
	// if we recieved a dictionary we should add it to our reference stack
    if (ref) {
      if (typeof ref !== 'object') {
        throw new Error('Reference object is not an object');
      }
      referenceStack.unshift(ref);
    }
	// if we recieved a scope we should add it to our scope stack
    if (scope) {
      if (!(scope instanceof Model))
        throw new Error('Scope is not an instanceof Model');
      scopeStack.unshift(ref);
    }
	// now onto creating the element, search for an alloy with that tag
    let alloy = getAlloyDefinition(tag);
    // if we have an alloy definition use that, otherwise use createElement
    element = alloy ? alloy() : document.createElement(tag);
    // now we can work through our attribute list
    for (let attribute in options) {
	  // if the attribute exist then execute it using the element as a context
      if (ATTRIBUTES[attribute]) {
        ATTRIBUTES[attribute].apply(element, options[attribute]);
	  // otherwise just try to set the value
  	  } else if (!IGNORE_ATTRIBUTES.has(attribute))
        element[attribute] = options[attribute];
    }
	// if we had a dictionary then we should remove it from the stack
    if (ref)
      referenceStack.shift();
	// if we had a scope then we should remove it from the stack
    if (scope)
      scopeStack.shift();
  }
  // if a parent has been specfied then append the element now
  parent && requireInstance(parent, HTMLElement) && parent.appendChild(element);
  // return the completed element
  return element;
}
export create;
