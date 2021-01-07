import curry from './curry.js';
import isFunction from './is-function.js';

function _map(list, fn) {
  if (isFunction(list.map)) {
    return list.map(fn);
  }
  return Array.from(list).map(fn);
}

export default function map(list, fn) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_map, list);
  }
  return _map(list, fn);
}
