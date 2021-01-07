import curry from './curry.js';

function _neq(a, b) {
  return a !== b;
}

export default function neq(a, b) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_neq, a);
  }
  return _neq(a, b);
}
