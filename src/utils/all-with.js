import keyMap from './key-map.js';
import reduce from './reduce.js';
import curry from './curry.js';

function _allWith(list, key, target) {
  const km = keyMap(key);
  const checker =
    // eslint-disable-next-line no-magic-numbers
    arguments.length === 2
      ? (value) => {
          return key in value;
        }
      : (value) => {
          return km(value) === target;
        };
  return reduce(
    list,
    (acc, v) => {
      return acc && checker(v);
    },
    true
  );
}

export default function allWith(list, key, value) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_allWith, list);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_allWith, list, key);
  }
  return _allWith(list, key, value);
}
