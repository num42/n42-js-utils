import curry from './curry.js';
import concat from './concat.js';
import isString from './is-string.js';
import isArray from './is-array.js';

function _append(a, b) {
  if (isString(a)) {
    return `${a}${b}`;
  }
  if (isArray(a)) {
    return concat(a, [b]);
  }
  // TODO(asol): if isObject merge?
  return String(a) + b;
}

export default function append(a, b) {
  if (arguments.length === 1) {
    return curry(_append, a);
  }
  return _append(a, b);
}
