import curry from './curry.js';

function _lt(a, b) {
  return a < b;
}

export default function lt(a, b) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_lt, a);
  }
  return _lt(a, b);
}
