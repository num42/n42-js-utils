import keyMap from './key-map.js';
import filter from './filter.js';
import pipeline from './pipeline.js';
import isFunction from './is-function.js';
import curry from './curry.js';
import eq from './eq.js';

function _filterBy(list, key, target) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return filter(list, (value) => {
      return key in value;
    });
  }
  const km = keyMap(key);
  const checker = pipeline(km, isFunction(target) ? target : eq(target));
  return filter(list, checker);
}

export default function filterBy(list, key, value) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_filterBy, list);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_filterBy, list, key);
  }
  return _filterBy(list, key, value);
}
