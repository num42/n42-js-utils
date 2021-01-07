import curry from './curry.js';

function _split(string, charOrRegex) {
  return string.split(charOrRegex);
}

export default function split(string, charOrRegex) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_split, string);
  }
  return _split(string, charOrRegex);
}
