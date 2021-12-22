import curry from './curry.js';
import isFunction from './is-function.js';

const _reduce = (list, fn, initial) => {
  if (isFunction(list.reduce)) {
    return list.reduce(fn, initial);
  }
  return Array.from(list).reduce(fn, initial);
};

export default function reduce(list, fn, initial) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_reduce, list, null);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_reduce, list, fn);
  }
  return _reduce(list, fn, initial);
}
