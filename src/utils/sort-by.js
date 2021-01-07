import keyMap from './key-map.js';
import sort from './sort.js';
import { ASCENDING, DESCENDING, RANDOM } from './sort.js';
import pipe from './pipe.js';
import curry from './curry.js';

export default sortBy;
export { RANDOM as RANDOM };
export { ASCENDING as ASCENDING };
export { DESCENDING as DESCENDING };

function _sortBy(list, key, directionFn = DESCENDING) {
  const mapper = keyMap(key);
  return pipe(
    list,
    sort((a, b) => {
      return directionFn(mapper(a), mapper(b));
    })
  );
}

function sortBy(list, key, directionFn = DESCENDING) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_sortBy, list);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_sortBy, list, key);
  }
  return _sortBy(list, key, directionFn);
}
