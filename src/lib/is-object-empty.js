import isObject from './is-object.js';

export default function isObjectEmpty(obj) {
  return isObject(obj) && Object.keys(obj).length === 0;
}
