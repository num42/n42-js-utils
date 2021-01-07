import slice from './slice.js';
import recursive from './recursive.js';
import isFunction from './is-function.js';
import isArrayEmpty from './is-array-empty.js';

function _pipeMixed(data, ops) {
  return recursive(
    // initial value
    ops,

    // exit when no operations are left to perform
    (operations) => {
      return isArrayEmpty(operations);
    },

    // process data
    // NOTE: we switcheroo accumulator and data here, because the data in a
    // stream is the accumulator :)
    // first operation may be an function or object containing an exec function
    // passing in an object allows for transmuting the pipeline.
    (operations, currentData) => {
      const operation = operations[0];
      const next = slice(operations, 1, null);

      if (isFunction(operation)) {
        const current = operation(currentData);
        return { next, current };
      }
      return operation.exec(currentData, next);
    },

    // Accumulate data
    data
  );
}

function _pipePure(data, operations) {
  return operations.reduce((acc, operation) => {
    return operation(acc);
  }, data);
}

export default function pipe(data, ...operations) {
  // if all operations are functions, we can use the optimized pipe function
  if (
    operations.reduce((acc, operation) => {
      return acc && isFunction(operation);
    }, true)
  ) {
    return _pipePure(data, operations);
  }
  return _pipeMixed(data, operations);
}
