import curry from './curry.js';

function _eq(a, b) {
  return a === b;
}

export default function eq(a, b) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_eq, a);
  }
  return _eq(a, b);
}
