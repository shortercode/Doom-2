## Alloying

The process of creating an extensible class from a native element.

Alloying provides a similar functionality to the native custom elements API but for Doom, but actively supports inheritance from more "exotic" elements such as HTMLCanvasElement. Extending anything other than HTMLElement is currently unavailable in custom element v0/v1 implementations in the browser.

AlloyElement classes provide a variety of concise and useful methods for manipulating the element, as well a pluggable event extension system that includes touch gestures and dom mutation events support by default.

AlloyElement instances exist as a partner to a separate native element instance, normally the native element acts as more of a "silent partner" but it is accessible via the AlloyElement.element property should you need to manipulate it directly.

Multiple levels of inheritance are allowed from an AlloyElement.

Using in conjunction with define will allow you to create these elements via a `create` call.

Inheritance chain: `NativeAlloyElement > AlloyElement > EventEmitter`

Method alloy

Class alloy(String tagName)

Argument tagName is the name of a built-in element, such as "div". Returns a new class called NativeAlloyElement that extends AlloyElement and contains implicit construction of the specified built-in element on instantiation.

Example:
```javascript
import { alloy, define } from './doom/define';
import modify from './doom/modify';
import create from './doom/create';

const Button = alloy('button');

class FancyButton extends Button {
	constructor () {
		super();
		this.on('click', e => this.drawRipple(e.offsetX, e.offsetY));
	}
	drawRipple (x, y) {
		const div = create({
			tag: 'div',
			class: 'ripple',
			parent: this,
			style: `left: ${x}px; top: ${y}px;`,
			once: {
				transitionend: e => div.remove()
			}
		});
		
		modify({
			element: div,
			addClass: 'run',
			delay: 'nextframe'
		});
	}
}

define('fancy-button', FancyButton);

const myButton = create('fancy-button');
```