import slice from './slice.js';
import length from './length.js';
import first from './first.js';
import isNone from './is-none.js';
import isEmpty from './is-empty.js';

function _instantiate() {
  const args = [...arguments];
  const lastIndex = args.length - 1;
  const instanceArgs = slice(args, 0, lastIndex);

  if (isEmpty(instanceArgs)) {
    return null;
  } // no arguments to instantiate with
  // eslint-disable-next-line no-magic-numbers
  if (length(instanceArgs) === 0) {
    return null;
  } // only a klass to instantiate with. we expect at least one argument to pass to the klass so exit here

  const firstArg = first(instanceArgs);
  // eslint-disable-next-line no-magic-numbers
  if (length(instanceArgs) === 1 && isNone(firstArg)) {
    return null;
  }

  const Klass = args[lastIndex];
  return new Klass(...instanceArgs);
}

export default function instantiate() {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 0) {
    return null;
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return (...args) => {
      return _instantiate(...args, arguments[0]);
    };
  }
  return _instantiate(...arguments);
}
