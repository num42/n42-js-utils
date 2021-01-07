import curry from './curry.js';
import isArrayEmpty from './is-array-empty.js';
import isFunction from './is-function.js';
import isNone from './is-none.js';

function _find(list, finderFunction) {
  if (isNone(list)) {
    return null;
  }
  if (isArrayEmpty(list)) {
    return null;
  }
  if (isFunction(list.find)) {
    return list.find(finderFunction) || null;
  }
  return Array.from(list).find(finderFunction) || null;
}

export default function find(list, finderFunction) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_find, list);
  }
  return _find(list, finderFunction);
}
