# Doom 2 Style Guide

Code styling guidelines for the Doom 2 project

### ES2015

All methods should use ES2015 methods as standard where appropriate, these include but are not limited to:

- Promises
- Arrow functions
- Modules
- `for ... of` loops
- Classes
- Block scoped variables
- Collections, `Map`  `Set`
- Property and method shorthand
- The spread operator
- Default properties

The following ES2015 methods should be avoided for the time being, either for portability or readability:

- Destructuring

### Variables and type checking

All public methods on each module use strict type checks on parameters, and throw relevant errors.

Private methods may avoid type checks at the developers discretion, but all user input must be sanitized before reaching these methods.

Asynchronous methods return a `promise` instance representing the return value of the method call.

It is preferable that private methods are not part of a class unless absolutely necessary, instead stateless methods within the class Module that accept a context object and an array of arguments should be utilised.

In non-error bail cases methods should return either a relevant output or `null`.

All properties for a class are defined in it's constructor, if they do not yet have a value they are assigned the value null.

### Naming

Module variables are defined using `const` where possible, using the naming convention `CONSTANT_VARIABLE`.

Local and mutable module variables are defined using `let`, using the naming convention `mutableVariable`.

Private properties and methods are prefixed with an underscore, for example: `_privateMethod`.

Variable declaration is not chained, and only one variable is declared per line

### Whitespace

All methods have a clear line of whitespace before and after.

### Layout

Source files conform to the following layout and order:

1. Copyright notice and license
2. Contributor list
3. File description
4. Imports
5. Module level constants
6. Module level mutables
7. Module level functions
8. Module setup (optional if stateless)
9. Module exports

### Misc

Method chaining may be used where appropriate.

Inline functions should be declared using arrow notation.

Variables are defined before any logic within a function.

Single statement per line.

Simple ternary and logical statements are allowed