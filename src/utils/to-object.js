import reduce from './reduce.js';

export default function toObject(list) {
  return reduce(
    list,
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );
}
