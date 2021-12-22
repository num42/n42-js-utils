import curry from './curry.js';

function _match(string, regex) {
  return string.match(regex);
}

export default function match(string, regex) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_match, string);
  }
  return _match(string, regex);
}
