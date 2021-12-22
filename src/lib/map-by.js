import map from './map.js';
import keyMap from './key-map.js';
import curry from './curry.js';

export default function mapBy(list, keys) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(map, keyMap(list));
  }
  return map(list, keyMap(keys));
}
