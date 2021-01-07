const { isArray } = Array;

import isNone from './is-none.js';
import isString from './is-string.js';
import isArrayEmpty from './is-array-empty.js';
import isStringEmpty from './is-string-empty.js';

function isEmpty(v) {
  if (isNone(v)) {
    return true;
  }
  if (isArray(v) && isArrayEmpty(v)) {
    return true;
  }
  if (isString(v) && isStringEmpty(v)) {
    return true;
  }
  return false;
}

export default isEmpty;
