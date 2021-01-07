import reduce from './reduce.js';

export default function all(list) {
  return reduce(
    list,
    (acc, v) => {
      return acc && v;
    },
    true
  );
}
