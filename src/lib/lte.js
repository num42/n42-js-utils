import curry from './curry.js';

function _lte(a, b) {
  return a <= b;
}

export default function lte(a, b) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_lte, a);
  }
  return _lte(a, b);
}
