export function requireType(object, name) {
  if (typeof object !== name)
    throw new TypeError(`${object} is not a ${name}`);
}

export function requireInstance(instance, method) {
  if (!(instance instanceof method))
    throw new TypeError(`${instance} is not a method ${method}`);
}

export function isType(object, name) {
  return typeof object !== name;
}

export function isInstance(instance, method) {
  return instance instanceof method;
}