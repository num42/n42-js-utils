import reduce from './reduce.js';
import keyMap from './key-map.js';
import curry from './curry.js';

function _groupBy(arr, key) {
  const valueFunction = keyMap(key);

  return reduce(
    arr,
    (acc, obj) => {
      const val = valueFunction(obj);
      // eslint-disable-next-line no-undefined
      if (acc[val] === undefined) {
        acc[val] = [];
      }
      acc[val].push(obj);
      return acc;
    },
    {}
  );
}

export default function groupBy(arr, key) {
  if (arguments.length === 1) {
    return curry(_groupBy, arr);
  }
  return _groupBy(arr, key);
}
