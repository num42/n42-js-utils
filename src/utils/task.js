/* eslint-disable max-classes-per-file */
import isPromise from './is-promise.js';
import any from './any.js';
import pipe from './pipe.js';
import pipeline from './pipeline.js';
import map from './map.js';
import filter from './filter.js';
import not from './not.js';
import eq from './eq.js';
import isNone from './is-none.js';
import first from './first.js';
import curry from './curry.js';
import conditional from './conditional.js';
import both from './both.js';

const NOOP = () => {
  /**/
};

function setImmediate(fn) {
  setTimeout(fn, 0);
}

function defineGetterFunction(prop) {
  return (obj) => {
    return obj[prop];
  };
}
function defineSetterFunction(prop) {
  return (obj, v) => {
    obj[prop] = v;
    return obj;
  };
}

function* idGen() {
  let id = 0;
  while (true) {
    yield ++id;
  }
}

const taskIdGen = idGen();
const operationIdGen = idGen();

const SYM_Mode = 'mode';
const SYM_Task = 'task';
const SYM_IsRunning = 'isRunning';
const SYM_IsCancelled = 'isCancelled';
const SYM_Id = 'id';
const SYM_Context = 'context';
const SYM_Promise = 'promise';
const SYM_Generator = 'generator';
const SYM_Operations = 'operations';
const SYM_Iterator = 'iterator';

const getMode = defineGetterFunction(SYM_Mode);
const setMode = defineSetterFunction(SYM_Mode);
const getTask = defineGetterFunction(SYM_Task);
const setTask = defineSetterFunction(SYM_Task);
const getIsRunning = defineGetterFunction(SYM_IsRunning);
const setIsRunning = defineSetterFunction(SYM_IsRunning);
const getIsCancelled = defineGetterFunction(SYM_IsCancelled);
const setIsCancelled = defineSetterFunction(SYM_IsCancelled);
const getId = defineGetterFunction(SYM_Id);
const setId = defineSetterFunction(SYM_Id);
const getContext = defineGetterFunction(SYM_Context);
const setContext = defineSetterFunction(SYM_Context);
const getPromise = defineGetterFunction(SYM_Promise);
const setPromise = defineSetterFunction(SYM_Promise);
const getGenerator = defineGetterFunction(SYM_Generator);
const setGenerator = defineSetterFunction(SYM_Generator);
const getOperations = defineGetterFunction(SYM_Operations);
const setOperations = defineSetterFunction(SYM_Operations);
const getIterator = defineGetterFunction(SYM_Iterator);
const setIterator = defineSetterFunction(SYM_Iterator);

const isNotCancelled = pipeline(isCancelled, not);
const isRunningAndNotCancelled = pipeline(both(isRunning, isNotCancelled));
const getRunningOperations = pipeline(getOperations, filter(isRunning));
const getCurrentOperation = pipeline(getRunningOperations, first);
const isTaskRunning = pipeline(
  getRunningOperations,
  map(isRunningAndNotCancelled),
  any
);
const isTaskNotRunning = pipeline(isTaskRunning, not);
const isOperationRunning = pipeline(getIsRunning, eq(true));
const isTaskCancelled = pipeline(getIsCancelled, eq(true));
const isOperationCancelled = pipeline(getIsCancelled, eq(true));
const cancelOperation = pipeline(curry(setIsCancelled, true), getPromise);
const cancelOperations = pipeline(getOperations, map(cancelOperation));

const isNotRunning = pipeline(isRunning, not);
const getNextOperations = pipeline(
  getOperations,
  filter(isNotRunning),
  filter(isNotCancelled)
);

const getNextOperation = pipeline(getNextOperations, first);
const hasNextOperation = pipeline(getNextOperation, isNone, not);
const runNextOperation = pipeline(
  getNextOperation,
  conditional(isNone, NOOP, perform)
);

const getTaskAndRunNextOperation = pipeline(
  getTask,
  curry(setIsRunning, false),
  runNextOperation
);
const cleanAfterRun = pipeline(
  curry(setIsRunning, false),
  getTaskAndRunNextOperation
);

const performOperation = pipeline(curry(setIsRunning, true), (operation) => {
  return stepOperation(operation).then((value) => {
    cleanAfterRun(operation);
    return value;
  });
});

class Task {
  constructor({ generator, context, mode, idProvider }) {
    setId(this, (idProvider || taskIdGen).next().value);
    setGenerator(this, generator);
    setContext(this, context);
    setOperations(this, []);
    setMode(this, mode || 'drop');
    setIsRunning(this, false);
  }

  cancel() {
    return cancel(this);
  }
  run(...state) {
    return perform(this, ...state);
  }
  perform(...state) {
    return perform(this, ...state);
  }

  runNextOperation() {
    return runNextOperation(this);
  }
  createOperation(...state) {
    return createOperation(this, ...state);
  }
  enqueueNewOperation(...state) {
    return enqueueNewOperation(this, ...state);
  }
  enqueueNextOperation(...state) {
    return enqueueNextOperation(this, ...state);
  }
  pushOperation(operation) {
    return pushOperation(this, operation);
  }
  removeOperation(operation) {
    return removeOperation(this, operation);
  }

  static id(task) {
    return getId(task);
  }
  static getId(task) {
    return getId(task);
  }
  static isRunning(task) {
    return isRunning(task);
  }
  static hasNextOperation(task) {
    return hasNextOperation(task);
  }
  static getCurrentOperation(task) {
    return getCurrentOperation(task);
  }
  static getRunningOperations(task) {
    return getRunningOperations(task);
  }

  static cancel(task) {
    return cancel(task);
  }
  static run(task, ...state) {
    return perform(task, ...state);
  }
  static perform(task, ...state) {
    return perform(task, ...state);
  }

  static runNextOperation(task) {
    return runNextOperation(task);
  }
  static createOperation(task, ...state) {
    return createOperation(task, ...state);
  }
  static enqueueNewOperation(task, ...state) {
    return enqueueNewOperation(task, ...state);
  }
  static enqueueNextOperation(task, ...state) {
    return enqueueNextOperation(task, ...state);
  }
  static pushOperation(task, operation) {
    return pushOperation(task, operation);
  }
  static removeOperation(task, operation) {
    return removeOperation(task, operation);
  }
}

class Operation {
  constructor({ task, state, idProvider }) {
    const generator = getGenerator(task);
    const context = getContext(task);
    setIsRunning(this, false);
    setIsCancelled(this, false);
    setContext(this, context);
    setTask(this, task);
    setId(this, (idProvider || operationIdGen).next().value);
    setIterator(this, generator.call(context, ...state));
    setPromise(this, Promise.resolve);
  }

  run() {
    return perform(this);
  }
  cancel() {
    return cancel(this);
  }
  perform() {
    return perform(this);
  }

  static getId(operation) {
    return getId(operation);
  }
  static getTask(operation) {
    return getTask(operation);
  }
  static isRunning(operation) {
    return isRunning(operation);
  }
  static isCancelled(operation) {
    return isCancelled(operation);
  }
  static getPromise(operation) {
    return getPromise(operation);
  }

  static run(operation) {
    return perform(operation);
  }
  static cancel(operation) {
    return cancel(operation);
  }
  static perform(operation) {
    return perform(operation);
  }
}

function cancel(taskOrOperation) {
  if (taskOrOperation instanceof Task) {
    return cancelTask(taskOrOperation);
  }
  if (taskOrOperation instanceof Operation) {
    return cancelOperation(taskOrOperation);
  }
  return false;
}

function perform(taskOrOperation, ...state) {
  if (taskOrOperation instanceof Task) {
    return performTask(taskOrOperation, ...state);
  }
  if (taskOrOperation instanceof Operation) {
    return performOperation(taskOrOperation, ...state);
  }
  return false;
}

function performTask(task, ...state) {
  switch (getMode(task)) {
    case 'drop':
      return performTaskInModeDrop(task, ...state);
    case 'restart':
      return performTaskInModeRestart(task, ...state);
    case 'keepLatest':
      return performTaskInModeKeepLatest(task, ...state);
    case 'enqueue':
      return performTaskInModeEnqueue(task, ...state);
    default:
      return performTaskDefault(task, ...state);
  }
}

function performTaskInModeRestart(task, ...state) {
  if (isTaskNotRunning(task)) {
    return enqueueNewOperation(task, ...state);
  }
  cancelOperations(task);
  return enqueueNewOperation(task, ...state);
}

function performTaskInModeDrop(task, ...state) {
  if (isTaskNotRunning(task)) {
    return enqueueNewOperation(task, ...state);
  }
  return pipe(task, getCurrentOperation, getPromise);
}

function performTaskInModeKeepLatest(task, ...state) {
  if (isTaskNotRunning(task)) {
    return enqueueNewOperation(task, ...state);
  }
  if (pipe(task, hasNextOperation, not)) {
    enqueueNextOperation(task, ...state);
  }
  return pipe(task, getCurrentOperation, getPromise);
}

function performTaskInModeEnqueue(task, ...state) {
  if (isTaskNotRunning(task)) {
    return enqueueNewOperation(task, ...state);
  }
  enqueueNextOperation(task, ...state);
  return pipe(task, getCurrentOperation, getPromise);
}

function performTaskDefault(task) {
  throw new Error(`Cannot perform task in mode: ${getMode(task)}`);
}

function enqueueNewOperation(task, ...state) {
  setIsRunning(task, true);
  return pipe(enqueueNextOperation(task, ...state), perform);
}

function enqueueNextOperation(task, ...state) {
  return pipe(createOperation(task, ...state), (operation) => {
    return pushOperation(task, operation);
  });
}

function pushOperation(task, operation) {
  setOperations(task, [...getOperations(task), operation]);
  return operation;
}

function removeOperation(task, operation) {
  const operationId = pipe(operation, getId);
  const operations = pipe(task, getOperations);
  const newOperations = pipe(
    operations,
    filter((op) => {
      return getId(op) !== operationId;
    })
  );
  setOperations(task, newOperations);
}

function stepOperation(operation, current) {
  const task = getTask(operation);
  const iterator = getIterator(operation);

  if (isCancelled(operation)) {
    return stepOperationIfCancelled(task, operation, current);
  }

  // `iterator.next` calls the next iteration of code in the passed in generator
  const item = iterator.next(current);
  const { done, value } = item;

  if (done) {
    return stepOperationIfDone(task, operation, value);
  }

  return stepOperationWithPromise(
    task,
    operation,
    new Promise((resolve, reject) => {
      setImmediate(async () => {
        const nextValue = isPromise(value) ? await value : value;
        stepOperation(operation, nextValue).then(resolve, reject);
      });
    })
  );
}

function stepOperationWithPromise(task, operation, promise) {
  return pipe(operation, curry(setPromise, promise), getPromise);
}

function stepOperationFinalStep(task, operation, value) {
  removeOperation(task, operation);

  const promise = new Promise((resolve) => {
    resolve(value);
  });

  return stepOperationWithPromise(task, operation, promise);
}

function stepOperationIfCancelled(task, operation, current) {
  return stepOperationFinalStep(task, operation, current);
}

function stepOperationIfDone(task, operation, value) {
  return stepOperationFinalStep(task, operation, value);
}

function cancelTask(task) {
  return Promise.all(cancelOperations(task));
}

function isRunning(taskOrOperation) {
  if (taskOrOperation instanceof Task) {
    return isTaskRunning(taskOrOperation);
  }
  if (taskOrOperation instanceof Operation) {
    return isOperationRunning(taskOrOperation);
  }
  return false;
}

function isCancelled(taskOrOperation) {
  if (taskOrOperation instanceof Task) {
    return isTaskCancelled(taskOrOperation);
  }
  if (taskOrOperation instanceof Operation) {
    return isOperationCancelled(taskOrOperation);
  }
  return false;
}

function createOperation(task, ...state) {
  return new Operation({ task, state });
}
function createTask({ generator, context, mode }) {
  return new Task({ generator, context, mode });
}

function _createTask(generator, context, mode) {
  return createTask({ generator, context, mode });
}
function _cancelTask(task) {
  return cancelTask(task);
}

export { _createTask as createTask };
export { _cancelTask as cancelTask };
