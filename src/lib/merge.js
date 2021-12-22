import reduce from './reduce.js';
import flatten from './flatten.js';
import curry from './curry.js';
import ownProperties from './own-properties.js';
import isArray from './is-array.js';
import isObject from './is-object.js';
import isNone from './is-none.js';

const { assign } = Object;

function _mergeDeep(target, source) {
  return reduce(
    ownProperties(source),
    (acc, key) => {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isArray(sourceValue) && isArray(targetValue)) {
        target[key] = flatten(sourceValue, targetValue);
      } else if (isObject(sourceValue) && isObject(targetValue)) {
        target[key] = _mergeDeep(assign({}, targetValue), sourceValue);
      } else {
        target[key] = sourceValue;
      }
      return acc;
    },
    target
  );
}

function _merge(target, ...sources) {
  return reduce(
    sources,
    (acc, v) => {
      if (isNone(v)) {
        return acc;
      }
      return _mergeDeep(acc, v);
    },
    target
  );
}

export default function merge(target, ...sources) {
  if (arguments.length === 1) {
    return curry(_merge, target);
  }
  return _merge(target, ...sources);
}
