import keyMap from './key-map.js';
import curry from './curry.js';
import find from './find.js';

function _findBy(list, key, target) {
  const mapper = keyMap(key);
  return find(list, (value) => {
    return mapper(value) === target;
  });
}

export default function findBy(list, key, target) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_findBy, list);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_findBy, list, key);
  }
  return _findBy(list, key, target);
}
