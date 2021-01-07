import curry from './curry.js';

function _replace(string, regex, replaceWith) {
  return string.replace(regex, replaceWith);
}

export default function replace(string, regex, replaceWith) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_replace, string, regex);
  }
  return _replace(string, regex, replaceWith);
}
