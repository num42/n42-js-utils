import curry from './curry.js';

function _concat(arr1, arr2) {
  return arr1.concat(arr2);
}

export default function concat(arr, amount) {
  if (arguments.length === 1) {
    return curry(_concat, arr);
  }
  return _concat(arr, amount);
}
