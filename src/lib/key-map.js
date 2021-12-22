import isFunction from './is-function.js';
import isArray from './is-array.js';
import isNone from './is-none.js';
import map from './map.js';
import pipe from './pipe.js';
import curry from './curry.js';
import toObject from './to-object.js';

function extractValue(key, obj) {
  if (isNone(obj)) {
    // eslint-disable-next-line no-undefined
    return undefined;
  }
  if (!(key in obj)) {
    // eslint-disable-next-line no-undefined
    return undefined;
  }
  if (isFunction(obj[key])) {
    return obj[key]();
  }
  return obj[key];
}

function extractSingleValue(key) {
  return (obj) => {
    return extractValue(key, obj);
  };
}

function extractMultipleValues(keys) {
  return (obj) => {
    return pipe(obj, keys, map(curry(extractValue, obj)), toObject);
  };
}

export default function (keys) {
  if (isArray(keys)) {
    return extractMultipleValues(keys);
  }
  return extractSingleValue(keys);
}
