import isArrayEmpty from './is-array-empty.js';
import isFunction from './is-function.js';
import length from './length.js';

export default (list) => {
  if (isArrayEmpty(list)) {
    return null;
  }
  const len = length(list);
  const lastIndex = len - 1;
  if (isFunction(list.item)) {
    return list.item(lastIndex);
  }
  if (isFunction(list.getItem)) {
    return list.getItem(lastIndex);
  }
  if (isFunction(list.objectAt)) {
    return list.objectAt(lastIndex);
  }
  if (isFunction(list.charAt)) {
    return list.charAt(lastIndex);
  }
  return list[lastIndex];
};
