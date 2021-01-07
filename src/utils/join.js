import curry from './curry.js';

function _join(list, char) {
  return Array.from(list).join(char);
}

export default function join(list, char) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_join, list);
  }
  return _join(list, char);
}
