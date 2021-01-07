import curry from './curry.js';
import isFunction from './is-function.js';
import isEmpty from './is-empty.js';
import isNone from './is-none.js';
import find from './find.js';
import eq from './eq.js';

function _includes(includee, target) {
  if (isEmpty(includee)) {
    return false;
  }

  // try native approach first
  if (isFunction(includee.includes)) {
    return includee.includes(target);
  }

  // fall back to find method. We assume something includes a target, if target
  // can be found within something
  const item = find(includee, eq(target));
  return !isNone(item);
}

export default function includes(includee, target) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_includes, includee);
  }
  return _includes(includee, target);
}
