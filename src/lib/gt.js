import curry from './curry.js';

function _gt(a, b) {
  return a > b;
}

export default function gt(a, b) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_gt, a);
  }
  return _gt(a, b);
}
