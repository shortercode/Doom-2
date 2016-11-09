import {
  requireInstance,
  requireType,
  isType
} from './util';
import getAlloyDefinition from './define';

let referenceStack = [];
let scopeStack = [];

const ATTRIBUTES = {
  children(children) {
    requireInstance(children, Array);
    for (let child of children) {
      create(child, this);
    }
  },
  events(events) {
    requireInstance(events, Object);
    for (let eventName in events) {
      this.addEventListener(eventName, events[eventName]);
    }
  },
  attributes(attributes) {
    requireInstance(attributes, Object);
    for (let attributeName in attributes) {
      this.setAttribute(attributeName, attributes[attributeName]);
    }
  },
  properties(properties) {
    requireInstance(properties, Object);
    for (let propertyName in properties) {
      this[propertyName] = properties[propertyName];
    }
  },
  template(str) {
    requireType(str, 'string');
    if (!scopeStack[0])
      throw new Error("No scope defined for template \"" + str + "\"");
    new Template(this, scopeStack[0], str);
  },
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

function create(options, parent) {
  let element;
  if (isType(options, 'string')) {
    // if options was supplied as a string, use that as the tagName
    let alloy = getAlloyDefinition(tag);
    element = alloy ? alloy() : document.createElement(tag);
  } else {
    requireInstance(options, Object);
    const tag = options.tag;
    const ref = obj["dictionary"];
    const scope = obj["scope"];
    if (ref) {
      if (typeof ref !== 'object') {
        throw new Error('Reference object is not an object');
      }
      referenceStack.unshift(ref);
    }
    if (scope) {
      if (!(scope instanceof Model)) {
        throw new Error('Scope is not an instanceof Model');
      }
      scopeStack.unshift(ref);
    }
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
    if (ref)
      referenceStack.shift();
    if (scope)
      scopeStack.shift();
  }
  // check for optional
  parent = parent || options.parent;
  parent && requireInstance(parent, HTMLElement) && parent.appendChild(element);
  return element;
}
export create;