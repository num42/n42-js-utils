import isNone from './is-none.js';
import curry from './curry.js';

function _slice(slicable, start, end) {
  return isNone(end) ? slicable.slice(start) : slicable.slice(start, end);
}

export default function slice(slicable, start, end) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_slice, slicable);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_slice, slicable, start);
  }
  return _slice(slicable, start, end);
}
