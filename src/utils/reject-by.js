import keyMap from './key-map.js';
import isFunction from './is-function.js';
import reject from './reject.js';
import curry from './curry.js';
import eq from './eq.js';
import pipeline from './pipeline.js';

function _rejectBy(list, key, target) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return reject(list, (value) => {
      return key in value;
    });
  }
  const km = keyMap(key);
  const checker = pipeline(km, isFunction(target) ? target : eq(target));
  return reject(list, checker);
}

export default function rejectBy(list, key, value) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_rejectBy, list);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_rejectBy, list, key);
  }
  return _rejectBy(list, key, value);
}
