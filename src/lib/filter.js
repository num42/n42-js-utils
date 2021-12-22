import curry from './curry.js';
import isFunction from './is-function.js';

const _filter = (list, fn) => {
  if (isFunction(list.filter)) {
    return list.filter(fn);
  }
  return Array.from(list).filter(fn);
};

export default function filter(list, fn) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_filter, list);
  }
  return _filter(list, fn);
}
