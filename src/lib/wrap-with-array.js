import conditional from './conditional.js';
import isArray from './is-array.js';

export default conditional(
  isArray,
  (e) => {
    return e;
  },
  (e) => {
    return [e];
  }
);
