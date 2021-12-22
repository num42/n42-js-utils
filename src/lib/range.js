function _range(min, max) {
  return Array(max - min)
    .fill(min)
    .map((e, i) => {
      return e + i;
    });
}

export default function range(min, max) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 0) {
    // eslint-disable-next-line no-magic-numbers
    return _range(0, 100);
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    // eslint-disable-next-line no-magic-numbers
    return _range(0, min);
  }
  return _range(min, max);
}
