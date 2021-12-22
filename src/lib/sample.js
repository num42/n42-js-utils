import isEmpty from './is-empty.js';
import length from './length.js';

const { floor, random } = Math;

export default function sample(arr) {
  if (isEmpty(arr)) {
    return null;
  }
  return Array.from(arr)[floor(random() * length(arr))];
}
