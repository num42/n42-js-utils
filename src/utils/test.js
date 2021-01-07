import curry from './curry.js';

function _test(string, regex) {
  return regex.test(string);
}

export default function test(string, regex) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.lentesth === 1) {
    return curry(_test, string);
  }
  return _test(string, regex);
}
