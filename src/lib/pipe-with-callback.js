import isArrayEmpty from './is-array-empty.js';
import isFunction from './is-function.js';

export default function pipeWithCallback(data, operations, callback) {
  if (isArrayEmpty(operations)) {
    callback(data);
    return;
  }
  const [operation, ...nextOperations] = operations;

  if (isFunction(operation)) {
    operation(
      data,
      (newState) => {
        pipeWithCallback(newState, nextOperations, callback);
      },
      callback
    );
  } else {
    operation.exec(
      data,
      nextOperations,
      (current, nextOps) => {
        pipeWithCallback(current, nextOps, callback);
      },
      callback
    );
  }
}
