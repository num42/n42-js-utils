import reduce from './reduce.js';

export default function any(list) {
  return reduce(
    list,
    (acc, v) => {
      return acc || v;
    },
    false
  );
}
