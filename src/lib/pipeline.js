import pipe from './pipe.js';
import curry from './curry.js';

export default (...operations) => {
  return curry(pipe, ...operations);
};
