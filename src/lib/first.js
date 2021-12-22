import isArrayEmpty from './is-array-empty.js';
import isFunction from './is-function.js';

export default (list) => {
  if (isArrayEmpty(list)) {
    return null;
  }
  if (isFunction(list.getItem)) {
    return list.getItem(0);
  }
  if (isFunction(list.objectAt)) {
    return list.objectAt(0);
  }
  if (isFunction(list.charAt)) {
    return list.charAt(0);
  }
  return list[0];
};
