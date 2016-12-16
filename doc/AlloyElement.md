# AlloyElement

## Properties
	
#### id
#### class
#### text
#### html
#### children
#### style
#### parent
#### root
#### first
#### last
#### next
#### previous

## Methods

#### on
'''javascript

'''
#### off
#### once
#### addEventListener
#### removeEventListener
#### is
#### search
#### searchAll
#### insert
Inserts a HTMLElement to the alloy instance as child node. Can be used with or without a reference position. If no reference position is specified then the HTMLElement will be appended as the last child.

Alloy.insert(HTMLElement newNode)

or

Alloy.insert(HTMLElement newNode, String position, HTMLElement referenceNode)

position may be either "before" or "after"

'''javascript
	let toolbar = new Toolbar();
	
	// toolbar.children = []
	
	let elementA = create('button');
	toolbar.insert(elementA);
	
	// toolbar.children = [elementA]
	
	let elementB = create('button');
	toolbar.insert(elementB, 'before', elementA);
	
	// toolbar.children = [elementB, elementA]
	
	let elementC = create('button');
	toolbar.insert(elementC, 'after', elementB);
	
	// toolbar.children = [elementB, elementC, elementA]
'''
#### remove