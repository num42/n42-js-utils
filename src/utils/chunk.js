import curry from './curry.js';
import recursive from './recursive.js';
import isArrayEmpty from './is-array-empty.js';
import slice from './slice.js';
import concat from './concat.js';

function _chunk(inputArray, amount) {
  if (amount === 0) {
    return [inputArray];
  }
  if (isArrayEmpty(inputArray)) {
    return [[]];
  }
  const stopCondition = (arr) => {
    return isArrayEmpty(arr);
  };

  const reducer = (acc, v) => {
    return {
      // eslint-disable-next-line no-undefined
      next: slice(v, amount, undefined),
      current: concat(acc, [slice(v, 0, amount)]),
    };
  };

  return recursive(inputArray, stopCondition, reducer, []);
}

export default function chunk(arr, amount) {
  if (arguments.length === 1) {
    return curry(_chunk, arr);
  }
  return _chunk(arr, amount);
}
