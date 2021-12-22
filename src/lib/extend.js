import ownProperties from './own-properties.js';
import isFunction from './is-function.js';
import reduce from './reduce.js';
import curry from './curry.js';
import pipe from './pipe.js';

function _extend(target, source) {
  return pipe(
    source,
    ownProperties,
    reduce((acc, key) => {
      acc[key] = isFunction(source[key]) ? source[key].bind(acc) : source[key];
      return acc;
    }, target)
  );
}

export default function extend(target, source) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_extend, target);
  }
  return _extend(target, source);
}
