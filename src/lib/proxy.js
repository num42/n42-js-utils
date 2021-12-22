import curry from './curry.js';

function _proxy(target, traps) {
  return new Proxy(target, traps);
}

export default function proxy(target, traps) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_proxy, target);
  }
  return _proxy(target, traps);
}
