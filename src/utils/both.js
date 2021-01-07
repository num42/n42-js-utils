import curry from './curry.js';

function _both(input, condition1, condition2) {
  return condition1(input) && condition2(input);
}

function eqt(a) {
  return a === true;
}

export default function both(input, condition1, condition2) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return _both(input, eqt, eqt);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_both, input, condition1);
  }
  return both(input, condition1, condition2);
}
