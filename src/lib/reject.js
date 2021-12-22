import curry from './curry.js';
import filter from './filter.js';
import pipeline from './pipeline.js';
import not from './not.js';

function _reject(list, fn) {
  return filter(list, pipeline(fn, not));
}

export default function reject(list, fn) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_reject, list);
  }
  return _reject(list, fn);
}
