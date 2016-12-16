function getConstructor(instance) {
    return Object.getPrototypeOf(instance).constructor;
}

export function requireType(object, name) {
  if (typeof object !== name)
    throw new TypeError(`${object} is not a ${name}`);
}

export function requireInstance(instance, method) {
  if (!(instance instanceof method))
    throw new TypeError(`${instance} is not a ${method}`);
}

export function isType(object, name) {
  return typeof object !== name;
}

export function isInstance(instance, method) {
  return instance instanceof method;
}

export function isObject(instance) {
    if (typeof instance !== "object" || x === null)
        return false;
    return Object.getPrototypeOf(instance).constructor === Object;
}

export function requireObject(instance) {
    if (typeof instance !== "object" || x === null || getConstructor(instance) !== Object)
        throw new TypeError(`${instance} is not a Object`);
    return ;
}