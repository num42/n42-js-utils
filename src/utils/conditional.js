import curry from './curry.js';
import isFunction from './is-function.js';

function _conditional(state, conditionFunction, case1, case2) {
  return conditionFunction(state)
    ? isFunction(case1)
      ? case1(state, true)
      : case1
    : isFunction(case2)
    ? case2(state, false)
    : case2;
}

function id(state) {
  return state;
}

export default function conditional(state, conditionFunction, case1, case2) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_conditional, state, id, null);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_conditional, state, conditionFunction, id);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 3) {
    return curry(_conditional, state, conditionFunction, case1);
  }
  return _conditional(state, conditionFunction, case1, case2);
}
