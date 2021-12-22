import pipeline from './pipeline.js';
import pipe from './pipe.js';
import length from './length.js';
import slice from './slice.js';
import match from './match.js';
import conditional from './conditional.js';
import append from './append.js';
import gt from './gt.js';
import curry from './curry.js';
import isNone from './is-none.js';
import isEmpty from './is-empty.js';

// ()=>{return slice(string, 0, maxLength) + '…'},

// ex: "Hello this is Andy" => truncateToLastSpace(0, 12) => "Hello this…"
// ex: "Hello this is Andy" => truncateToLastSpace(0, 13) => "Hello this is…"
// ex: "Hello this is Andy" => truncateToLastSpace(0, 14) => "Hello this is…"
// ex: "Hello this is Andy" => truncateToLastSpace(0, 15) => "Hello this is…"
const truncateToLastSpace = pipeline(({ string, maxLength }) => {
  const lastCharMatch = pipe(
    string,
    slice(0, maxLength),
    // eslint-disable-next-line prefer-named-capture-group
    match(/( )\b(\w+)$/u)
  );
  return conditional(
    lastCharMatch,
    isNone,
    () => {
      return slice(string, 0, maxLength - 1);
    }, // last char is an space
    () => {
      return slice(string, 0, lastCharMatch.index);
    } // last char is an char
  );
}, append('…'));

function _truncate(string, maxLength) {
  if (isEmpty(string)) {
    return '';
  }
  return pipe(
    length(string || ''),
    conditional(
      gt(maxLength),
      truncateToLastSpace({ string, maxLength }),
      string
    )
  );
}

export default function truncate(string, maxLength) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_truncate, string);
  }
  return _truncate(string, maxLength);
}
