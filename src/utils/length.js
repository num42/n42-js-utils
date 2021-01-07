import isArray from './is-array.js';
import isString from './is-string.js';

export default function length(somethingWithLengthOrSize) {
  if (isArray(somethingWithLengthOrSize)) {
    return somethingWithLengthOrSize.length;
  }
  if (isString(somethingWithLengthOrSize)) {
    return somethingWithLengthOrSize.length;
  }
  return somethingWithLengthOrSize.size;
}
