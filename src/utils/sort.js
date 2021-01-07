import isFunction from './is-function.js';
import isNone from './is-none.js';
import curry from './curry.js';

const ASCENDING = (a, b) => {
  // eslint-disable-next-line no-magic-numbers
  return a < b ? -1 : a === b ? 0 : 1;
};
const DESCENDING = (a, b) => {
  // eslint-disable-next-line no-magic-numbers
  return a < b ? 1 : a === b ? 0 : -1;
};
const RANDOM = () => {
  // eslint-disable-next-line no-magic-numbers
  return Math.random() >= 0.5 ? -1 : 1;
};

function _sort(list, fn) {
  return list.sort(fn);
}

const sort = (list, fn = DESCENDING) => {
  if (!isNone(list) && isFunction(list)) {
    return curry(_sort, list);
  }
  return _sort(list, fn);
};

export default sort;
export { RANDOM as RANDOM };
export { ASCENDING as ASCENDING };
export { DESCENDING as DESCENDING };
