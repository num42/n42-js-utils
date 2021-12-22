import map from './map.js';
import find from './find.js';
import isEmpty from './is-empty.js';
import isFunction from './is-function.js';
import curry from './curry.js';

function IDENTITY_FN(a) {
  return a;
}

function _uniq(list, fn = IDENTITY_FN) {
  if (isEmpty(list)) {
    return [];
  }
  return map([...new Set(map(list, fn))], (k) => {
    return find(list, (el) => {
      return fn(el) === k;
    });
  });
}

export default function uniq(list, fn = IDENTITY_FN) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1 && isFunction(list)) {
    return curry(_uniq, list);
  }
  return _uniq(list, fn);
}
