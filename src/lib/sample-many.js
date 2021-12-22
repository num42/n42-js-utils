import isEmpty from './is-empty.js';
import length from './length.js';
import sort from './sort.js';
import slice from './slice.js';
import curry from './curry.js';

function _sampleMany(arr, amount) {
  if (isEmpty(arr)) {
    return [];
  }
  const len = length(arr);
  if (amount >= len) {
    return arr;
  }

  return slice(sort(arr, sort.RANDOM), 0, amount);
}

export default function sampleMany(arr, amount) {
  if (arguments.length === 0) {
    return [];
  }
  if (arguments.length === 1) {
    return curry(_sampleMany, arr);
  }
  return _sampleMany(arr, amount);
}
