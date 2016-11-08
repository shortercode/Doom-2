# DOOM 2 - Work in Progress

The next generation replacement for the Doom.js Framework

## Aims

- Maintain the concise but descriptive function naming
- Rework the hybrid element system
- Remove all native object extension
- Remove supplementary functions
- Refactor touch engine

## Proposals
Elements being interacted with will be wrapped with a common class that encapsulates common functions and extended features (e.g. touches and alloy).

```
var element = DOOM.create("div");

// HTMLElement { element: [HTMLElement div] }

el.on('tap', function (e) {
console.log("custom event");
});

el.on('click', function (e) {
console.log("vanilla event");
});

el.modify({
innerHTML: "methods can be applied directly to the element"
});
```
Hybrid elements will be treated exactly the same as HTMLElements, and will no longer have a separate constructor name property.

```
DOOM.create({
tag: 'div'
});
// ElementModel { element: [HTMLElement div] }
DOOM.create({
tag: 'carousel'
});
// ElementModel { element: [HTMLElement div], alloy: [HTMLAlloy carousel] }
```
## Specification
Creates an element using the given parameters

```
ElementModel create (Object parameters)
```
Returns element/s that match the given querySelector

```
ElementModel search (String querySelector)
```
Defines a new alloy type using a given class and label

```
HTMLAlloy define (String alloyName, Class alloyClass)
```
Modifies an element with given parameters

```
ElementModel modify (Object parameter)
```
Removes an element from its parent with an optional delay

```
ElementModel remove (ElementModel element, Integer delay)
```