// src/utils/is-function.js
function isFunction(fn) {
  return fn && {}.toString.call(fn) === "[object Function]";
}

// src/utils/is-array.js
function isArray(target) {
  return Array.isArray(target);
}

// src/utils/is-none.js
function isNone(value) {
  return value === null || value === void 0;
}

// src/utils/curry.js
function curry(fn, ...args) {
  return (a) => {
    return fn(a, ...args);
  };
}

// src/utils/map.js
function _map(list, fn) {
  if (isFunction(list.map)) {
    return list.map(fn);
  }
  return Array.from(list).map(fn);
}
function map(list, fn) {
  if (arguments.length === 1) {
    return curry(_map, list);
  }
  return _map(list, fn);
}

// src/utils/slice.js
function _slice(slicable, start, end) {
  return isNone(end) ? slicable.slice(start) : slicable.slice(start, end);
}
function slice(slicable, start, end) {
  if (arguments.length === 1) {
    return curry(_slice, slicable);
  }
  if (arguments.length === 2) {
    return curry(_slice, slicable, start);
  }
  return _slice(slicable, start, end);
}

// src/utils/recursive.js
function _recursive(arr, stopCondition, fn, accumulator) {
  let data = arr;
  let acc = accumulator;
  let stopped = stopCondition(data, acc);
  while (!stopped) {
    const { current, next } = fn(acc, data);
    acc = current;
    data = next;
    stopped = stopCondition(data, acc);
  }
  return acc;
}
function recursive(arr, fn, stopCondition, accumulator) {
  if (arguments.length === 3) {
    return curry(_recursive, arr, fn, stopCondition);
  }
  return _recursive(arr, fn, stopCondition, accumulator);
}

// src/utils/is-array-empty.js
function isArrayEmpty(arr) {
  return arr.length <= 0;
}

// src/utils/pipe.js
function _pipeMixed(data, ops) {
  return recursive(ops, (operations) => {
    return isArrayEmpty(operations);
  }, (operations, currentData) => {
    const operation = operations[0];
    const next = slice(operations, 1, null);
    if (isFunction(operation)) {
      const current = operation(currentData);
      return { next, current };
    }
    return operation.exec(currentData, next);
  }, data);
}
function _pipePure(data, operations) {
  return operations.reduce((acc, operation) => {
    return operation(acc);
  }, data);
}
function pipe(data, ...operations) {
  if (operations.reduce((acc, operation) => {
    return acc && isFunction(operation);
  }, true)) {
    return _pipePure(data, operations);
  }
  return _pipeMixed(data, operations);
}

// src/utils/reduce.js
var _reduce = (list, fn, initial) => {
  if (isFunction(list.reduce)) {
    return list.reduce(fn, initial);
  }
  return Array.from(list).reduce(fn, initial);
};
function reduce(list, fn, initial) {
  if (arguments.length === 1) {
    return curry(_reduce, list, null);
  }
  if (arguments.length === 2) {
    return curry(_reduce, list, fn);
  }
  return _reduce(list, fn, initial);
}

// src/utils/to-object.js
function toObject(list) {
  return reduce(list, (acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}

// src/utils/key-map.js
function extractValue(key, obj) {
  if (isNone(obj)) {
    return void 0;
  }
  if (!(key in obj)) {
    return void 0;
  }
  if (isFunction(obj[key])) {
    return obj[key]();
  }
  return obj[key];
}
function extractSingleValue(key) {
  return (obj) => {
    return extractValue(key, obj);
  };
}
function extractMultipleValues(keys2) {
  return (obj) => {
    return pipe(obj, keys2, map(curry(extractValue, obj)), toObject);
  };
}
function key_map_default(keys2) {
  if (isArray(keys2)) {
    return extractMultipleValues(keys2);
  }
  return extractSingleValue(keys2);
}

// src/utils/all-with.js
function _allWith(list, key, target) {
  const km = key_map_default(key);
  const checker = arguments.length === 2 ? (value) => {
    return key in value;
  } : (value) => {
    return km(value) === target;
  };
  return reduce(list, (acc, v) => {
    return acc && checker(v);
  }, true);
}
function allWith(list, key, value) {
  if (arguments.length === 1) {
    return curry(_allWith, list);
  }
  if (arguments.length === 2) {
    return curry(_allWith, list, key);
  }
  return _allWith(list, key, value);
}

// src/utils/all.js
function all(list) {
  return reduce(list, (acc, v) => {
    return acc && v;
  }, true);
}

// src/utils/any-with.js
function _anyWith(list, key, target) {
  const km = key_map_default(key);
  const checker = arguments.length === 2 ? (value) => {
    return key in value;
  } : (value) => {
    return km(value) === target;
  };
  return reduce(list, (acc, v) => {
    return acc || checker(v);
  }, false);
}
function allWith2(list, key, value) {
  if (arguments.length === 1) {
    return curry(_anyWith, list);
  }
  if (arguments.length === 2) {
    return curry(_anyWith, list, key);
  }
  return _anyWith(list, key, value);
}

// src/utils/any.js
function any(list) {
  return reduce(list, (acc, v) => {
    return acc || v;
  }, false);
}

// src/utils/concat.js
function _concat(arr1, arr2) {
  return arr1.concat(arr2);
}
function concat(arr, amount) {
  if (arguments.length === 1) {
    return curry(_concat, arr);
  }
  return _concat(arr, amount);
}

// src/utils/is-string.js
function isString(value) {
  return typeof value === "string";
}

// src/utils/append.js
function _append(a, b) {
  if (isString(a)) {
    return `${a}${b}`;
  }
  if (isArray(a)) {
    return concat(a, [b]);
  }
  return String(a) + b;
}
function append(a, b) {
  if (arguments.length === 1) {
    return curry(_append, a);
  }
  return _append(a, b);
}

// src/utils/both.js
function _both(input, condition1, condition2) {
  return condition1(input) && condition2(input);
}
function eqt(a) {
  return a === true;
}
function both(input, condition1, condition2) {
  if (arguments.length === 1) {
    return _both(input, eqt, eqt);
  }
  if (arguments.length === 2) {
    return curry(_both, input, condition1);
  }
  return both(input, condition1, condition2);
}

// src/utils/chunk.js
function _chunk(inputArray, amount) {
  if (amount === 0) {
    return [inputArray];
  }
  if (isArrayEmpty(inputArray)) {
    return [[]];
  }
  const stopCondition = (arr) => {
    return isArrayEmpty(arr);
  };
  const reducer = (acc, v) => {
    return {
      next: slice(v, amount, void 0),
      current: concat(acc, [slice(v, 0, amount)])
    };
  };
  return recursive(inputArray, stopCondition, reducer, []);
}
function chunk(arr, amount) {
  if (arguments.length === 1) {
    return curry(_chunk, arr);
  }
  return _chunk(arr, amount);
}

// src/utils/filter.js
var _filter = (list, fn) => {
  if (isFunction(list.filter)) {
    return list.filter(fn);
  }
  return Array.from(list).filter(fn);
};
function filter(list, fn) {
  if (arguments.length === 1) {
    return curry(_filter, list);
  }
  return _filter(list, fn);
}

// src/utils/is-string-empty.js
function isStringEmpty(value) {
  if (value === null || value === void 0) {
    return true;
  }
  return value.trim().length <= 0;
}

// src/utils/is-empty.js
var { isArray: isArray2 } = Array;
function isEmpty(v) {
  if (isNone(v)) {
    return true;
  }
  if (isArray2(v) && isArrayEmpty(v)) {
    return true;
  }
  if (isString(v) && isStringEmpty(v)) {
    return true;
  }
  return false;
}
var is_empty_default = isEmpty;

// src/utils/not-empty.js
function notEmpty(k) {
  return !is_empty_default(k);
}

// src/utils/compact.js
var compact_default = filter(notEmpty);

// src/utils/conditional.js
function _conditional(state, conditionFunction, case1, case2) {
  return conditionFunction(state) ? isFunction(case1) ? case1(state, true) : case1 : isFunction(case2) ? case2(state, false) : case2;
}
function id(state) {
  return state;
}
function conditional(state, conditionFunction, case1, case2) {
  if (arguments.length === 1) {
    return curry(_conditional, state, id, null);
  }
  if (arguments.length === 2) {
    return curry(_conditional, state, conditionFunction, id);
  }
  if (arguments.length === 3) {
    return curry(_conditional, state, conditionFunction, case1);
  }
  return _conditional(state, conditionFunction, case1, case2);
}

// src/utils/pipeline-transformation.js
function pipelineTransformation(fn, data) {
  return {
    exec(current, nextOperations) {
      return {
        next: fn(nextOperations, current, data),
        current
      };
    }
  };
}

// src/utils/debug.js
var debug_default = pipelineTransformation((operations, current) => {
  Error.stackTraceLimit = Infinity;
  console.info(current);
  return operations;
});

// src/utils/entries.js
var entries_default = Object.entries;

// src/utils/eq.js
function _eq(a, b) {
  return a === b;
}
function eq(a, b) {
  if (arguments.length === 1) {
    return curry(_eq, a);
  }
  return _eq(a, b);
}

// src/utils/exec.js
function exec(fn, args = []) {
  return (target) => {
    return target[fn](...args);
  };
}

// src/utils/own-properties.js
var { keys } = Object;
var own_properties_default = keys;

// src/utils/extend.js
function _extend(target, source) {
  return pipe(source, own_properties_default, reduce((acc, key) => {
    acc[key] = isFunction(source[key]) ? source[key].bind(acc) : source[key];
    return acc;
  }, target));
}
function extend(target, source) {
  if (arguments.length === 1) {
    return curry(_extend, target);
  }
  return _extend(target, source);
}

// src/utils/pipeline.js
var pipeline_default = (...operations) => {
  return curry(pipe, ...operations);
};

// src/utils/filter-by.js
function _filterBy(list, key, target) {
  if (arguments.length === 2) {
    return filter(list, (value) => {
      return key in value;
    });
  }
  const km = key_map_default(key);
  const checker = pipeline_default(km, isFunction(target) ? target : eq(target));
  return filter(list, checker);
}
function filterBy(list, key, value) {
  if (arguments.length === 1) {
    return curry(_filterBy, list);
  }
  if (arguments.length === 2) {
    return curry(_filterBy, list, key);
  }
  return _filterBy(list, key, value);
}

// src/utils/find-in-tree.js
function _findInTree(node, findFn, nextNodesFn) {
  if (isNone(node)) {
    return void 0;
  }
  if (findFn(node)) {
    return node;
  }
  return pipe(node, nextNodesFn, reduce((acc, nextNode) => {
    if (acc) {
      return acc;
    }
    return _findInTree(nextNode, findFn, nextNodesFn);
  }, null));
}
function findInTree(node, findFn, nextNodesFn) {
  if (arguments.length === 1) {
    return curry(_findInTree, node, key_map_default("children"));
  }
  if (arguments.length === 2) {
    return curry(_findInTree, node, findFn);
  }
  return _findInTree(node, findFn, nextNodesFn);
}

// src/utils/find-by-in-tree.js
function _findByInTree(node, target, value, nextNodesFn) {
  const findValue = key_map_default(target);
  return findInTree(node, (n) => {
    return findValue(n) === value;
  }, nextNodesFn);
}
function findByInTree(node, target, value, nextNodesFn) {
  if (arguments.length === 1) {
    return curry(_findByInTree, node, true, key_map_default("children"));
  }
  if (arguments.length === 2) {
    return curry(_findByInTree, node, target, key_map_default("children"));
  }
  if (arguments.length === 3) {
    return curry(_findByInTree, node, target);
  }
  return _findByInTree(node, target, value, nextNodesFn);
}

// src/utils/find.js
function _find(list, finderFunction) {
  if (isNone(list)) {
    return null;
  }
  if (isArrayEmpty(list)) {
    return null;
  }
  if (isFunction(list.find)) {
    return list.find(finderFunction) || null;
  }
  return Array.from(list).find(finderFunction) || null;
}
function find(list, finderFunction) {
  if (arguments.length === 1) {
    return curry(_find, list);
  }
  return _find(list, finderFunction);
}

// src/utils/find-by.js
function _findBy(list, key, target) {
  const mapper = key_map_default(key);
  return find(list, (value) => {
    return mapper(value) === target;
  });
}
function findBy(list, key, target) {
  if (arguments.length === 1) {
    return curry(_findBy, list);
  }
  if (arguments.length === 2) {
    return curry(_findBy, list, key);
  }
  return _findBy(list, key, target);
}

// src/utils/first.js
var first_default = (list) => {
  if (isArrayEmpty(list)) {
    return null;
  }
  if (isFunction(list.getItem)) {
    return list.getItem(0);
  }
  if (isFunction(list.objectAt)) {
    return list.objectAt(0);
  }
  if (isFunction(list.charAt)) {
    return list.charAt(0);
  }
  return list[0];
};

// src/utils/flatten.js
function flatten_default(arr, depth = Infinity) {
  return arr.flat(depth);
}

// src/utils/for-each.js
var for_each_default = map;

// src/utils/group-by.js
function _groupBy(arr, key) {
  const valueFunction = key_map_default(key);
  return reduce(arr, (acc, obj) => {
    const val = valueFunction(obj);
    if (acc[val] === void 0) {
      acc[val] = [];
    }
    acc[val].push(obj);
    return acc;
  }, {});
}
function groupBy(arr, key) {
  if (arguments.length === 1) {
    return curry(_groupBy, arr);
  }
  return _groupBy(arr, key);
}

// src/utils/gt.js
function _gt(a, b) {
  return a > b;
}
function gt(a, b) {
  if (arguments.length === 1) {
    return curry(_gt, a);
  }
  return _gt(a, b);
}

// src/utils/gte.js
function _gt2(a, b) {
  return a >= b;
}
function gt2(a, b) {
  if (arguments.length === 1) {
    return curry(_gt2, a);
  }
  return _gt2(a, b);
}

// src/utils/id.js
function identity(state) {
  return () => {
    return state;
  };
}

// src/utils/includes.js
function _includes(includee, target) {
  if (is_empty_default(includee)) {
    return false;
  }
  if (isFunction(includee.includes)) {
    return includee.includes(target);
  }
  const item = find(includee, eq(target));
  return !isNone(item);
}
function includes(includee, target) {
  if (arguments.length === 1) {
    return curry(_includes, includee);
  }
  return _includes(includee, target);
}

// src/utils/inject-pipeline-if.js
function injectPipelineIf(conditionFn, ...transformations) {
  return pipelineTransformation((operations, current) => {
    return conditionFn(current, operations, transformations) ? [...transformations, ...operations] : operations;
  });
}

// src/utils/inject-pipeline.js
function injectPipeline(...transformations) {
  return pipelineTransformation((operations) => {
    return [...transformations, ...operations];
  });
}

// src/utils/length.js
function length(somethingWithLengthOrSize) {
  if (isArray(somethingWithLengthOrSize)) {
    return somethingWithLengthOrSize.length;
  }
  if (isString(somethingWithLengthOrSize)) {
    return somethingWithLengthOrSize.length;
  }
  return somethingWithLengthOrSize.size;
}

// src/utils/instantiate.js
function _instantiate() {
  const args = [...arguments];
  const lastIndex = args.length - 1;
  const instanceArgs = slice(args, 0, lastIndex);
  if (is_empty_default(instanceArgs)) {
    return null;
  }
  if (length(instanceArgs) === 0) {
    return null;
  }
  const firstArg = first_default(instanceArgs);
  if (length(instanceArgs) === 1 && isNone(firstArg)) {
    return null;
  }
  const Klass = args[lastIndex];
  return new Klass(...instanceArgs);
}
function instantiate() {
  if (arguments.length === 0) {
    return null;
  }
  if (arguments.length === 1) {
    return (...args) => {
      return _instantiate(...args, arguments[0]);
    };
  }
  return _instantiate(...arguments);
}

// src/utils/is-number.js
function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

// src/utils/is-object.js
function isObject(obj) {
  return obj && typeof obj === "object";
}

// src/utils/is-object-empty.js
function isObjectEmpty(obj) {
  return isObject(obj) && Object.keys(obj).length === 0;
}

// src/utils/is-promise.js
function isPromise(obj) {
  return Boolean(obj) && typeof obj.then === "function";
}

// src/utils/join.js
function _join(list, char) {
  return Array.from(list).join(char);
}
function join(list, char) {
  if (arguments.length === 1) {
    return curry(_join, list);
  }
  return _join(list, char);
}

// src/utils/keys.js
var keys_default = Object.keys;

// src/utils/last.js
var last_default = (list) => {
  if (isArrayEmpty(list)) {
    return null;
  }
  const len = length(list);
  const lastIndex = len - 1;
  if (isFunction(list.item)) {
    return list.item(lastIndex);
  }
  if (isFunction(list.getItem)) {
    return list.getItem(lastIndex);
  }
  if (isFunction(list.objectAt)) {
    return list.objectAt(lastIndex);
  }
  if (isFunction(list.charAt)) {
    return list.charAt(lastIndex);
  }
  return list[lastIndex];
};

// src/utils/log.js
var log_default = pipelineTransformation((operations, current) => {
  console.log(current);
  return operations;
});

// src/utils/logger.js
var SHOULD_LOG = true;
function log(...args) {
  if (!SHOULD_LOG) {
    return;
  }
  console.log("[LOG]", `[${new Date().toISOString()}]`, ...args);
}
function warn(...args) {
  if (!SHOULD_LOG) {
    return;
  }
  console.warn("[WARNING]", `[${new Date().toISOString()}]`, ...args);
}
function error(...args) {
  console.error("[Error]", `[${new Date().toISOString()}]`, ...args);
}
function info(...args) {
  console.info(...args);
  return false;
}
var logger_default = {
  info,
  log,
  warn,
  error
};

// src/utils/lt.js
function _lt(a, b) {
  return a < b;
}
function lt(a, b) {
  if (arguments.length === 1) {
    return curry(_lt, a);
  }
  return _lt(a, b);
}

// src/utils/lte.js
function _lte(a, b) {
  return a <= b;
}
function lte(a, b) {
  if (arguments.length === 1) {
    return curry(_lte, a);
  }
  return _lte(a, b);
}

// src/utils/map-by.js
function mapBy(list, keys2) {
  if (arguments.length === 1) {
    return curry(map, key_map_default(list));
  }
  return map(list, key_map_default(keys2));
}

// src/utils/match.js
function _match(string, regex) {
  return string.match(regex);
}
function match(string, regex) {
  if (arguments.length === 1) {
    return curry(_match, string);
  }
  return _match(string, regex);
}

// src/utils/merge.js
var { assign } = Object;
function _mergeDeep(target, source) {
  return reduce(own_properties_default(source), (acc, key) => {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isArray(sourceValue) && isArray(targetValue)) {
      target[key] = flatten_default(sourceValue, targetValue);
    } else if (isObject(sourceValue) && isObject(targetValue)) {
      target[key] = _mergeDeep(assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
    return acc;
  }, target);
}
function _merge(target, ...sources) {
  return reduce(sources, (acc, v) => {
    if (isNone(v)) {
      return acc;
    }
    return _mergeDeep(acc, v);
  }, target);
}
function merge(target, ...sources) {
  if (arguments.length === 1) {
    return curry(_merge, target);
  }
  return _merge(target, ...sources);
}

// src/utils/neq.js
function _neq(a, b) {
  return a !== b;
}
function neq(a, b) {
  if (arguments.length === 1) {
    return curry(_neq, a);
  }
  return _neq(a, b);
}

// src/utils/not.js
function not_default(o) {
  return !o;
}

// src/utils/parse.js
var parse_default = JSON.parse;

// src/utils/pluck.js
var pluck_default = mapBy;

// src/utils/proxy.js
function _proxy(target, traps) {
  return new Proxy(target, traps);
}
function proxy(target, traps) {
  if (arguments.length === 1) {
    return curry(_proxy, target);
  }
  return _proxy(target, traps);
}

// src/utils/range.js
function _range(min, max) {
  return Array(max - min).fill(min).map((e, i) => {
    return e + i;
  });
}
function range(min, max) {
  if (arguments.length === 0) {
    return _range(0, 100);
  }
  if (arguments.length === 1) {
    return _range(0, min);
  }
  return _range(min, max);
}

// src/utils/reject.js
function _reject(list, fn) {
  return filter(list, pipeline_default(fn, not_default));
}
function reject(list, fn) {
  if (arguments.length === 1) {
    return curry(_reject, list);
  }
  return _reject(list, fn);
}

// src/utils/reject-by.js
function _rejectBy(list, key, target) {
  if (arguments.length === 2) {
    return reject(list, (value) => {
      return key in value;
    });
  }
  const km = key_map_default(key);
  const checker = pipeline_default(km, isFunction(target) ? target : eq(target));
  return reject(list, checker);
}
function rejectBy(list, key, value) {
  if (arguments.length === 1) {
    return curry(_rejectBy, list);
  }
  if (arguments.length === 2) {
    return curry(_rejectBy, list, key);
  }
  return _rejectBy(list, key, value);
}

// src/utils/replace.js
function _replace(string, regex, replaceWith) {
  return string.replace(regex, replaceWith);
}
function replace(string, regex, replaceWith) {
  if (arguments.length === 2) {
    return curry(_replace, string, regex);
  }
  return _replace(string, regex, replaceWith);
}

// src/utils/return-null.js
var return_null_default = () => {
  return null;
};

// src/utils/return-value.js
var return_value_default = identity;

// src/utils/sort.js
var DESCENDING = (a, b) => {
  return a < b ? 1 : a === b ? 0 : -1;
};
function _sort(list, fn) {
  return list.sort(fn);
}
var sort = (list, fn = DESCENDING) => {
  if (!isNone(list) && isFunction(list)) {
    return curry(_sort, list);
  }
  return _sort(list, fn);
};
var sort_default = sort;

// src/utils/sample-many.js
function _sampleMany(arr, amount) {
  if (is_empty_default(arr)) {
    return [];
  }
  const len = length(arr);
  if (amount >= len) {
    return arr;
  }
  return slice(sort_default(arr, sort_default.RANDOM), 0, amount);
}
function sampleMany(arr, amount) {
  if (arguments.length === 0) {
    return [];
  }
  if (arguments.length === 1) {
    return curry(_sampleMany, arr);
  }
  return _sampleMany(arr, amount);
}

// src/utils/sample.js
var { floor, random } = Math;
function sample(arr) {
  if (is_empty_default(arr)) {
    return null;
  }
  return Array.from(arr)[floor(random() * length(arr))];
}

// src/utils/sleep.js
function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

// src/utils/sort-by.js
var sort_by_default = sortBy;
function _sortBy(list, key, directionFn = DESCENDING) {
  const mapper = key_map_default(key);
  return pipe(list, sort_default((a, b) => {
    return directionFn(mapper(a), mapper(b));
  }));
}
function sortBy(list, key, directionFn = DESCENDING) {
  if (arguments.length === 1) {
    return curry(_sortBy, list);
  }
  if (arguments.length === 2) {
    return curry(_sortBy, list, key);
  }
  return _sortBy(list, key, directionFn);
}

// src/utils/split.js
function _split(string, charOrRegex) {
  return string.split(charOrRegex);
}
function split(string, charOrRegex) {
  if (arguments.length === 1) {
    return curry(_split, string);
  }
  return _split(string, charOrRegex);
}

// src/utils/stringify.js
var stringify_default = JSON.stringify;

// src/utils/task.js
var NOOP = () => {
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
  let id2 = 0;
  while (true) {
    yield ++id2;
  }
}
var taskIdGen = idGen();
var operationIdGen = idGen();
var SYM_Mode = "mode";
var SYM_Task = "task";
var SYM_IsRunning = "isRunning";
var SYM_IsCancelled = "isCancelled";
var SYM_Id = "id";
var SYM_Context = "context";
var SYM_Promise = "promise";
var SYM_Generator = "generator";
var SYM_Operations = "operations";
var SYM_Iterator = "iterator";
var getMode = defineGetterFunction(SYM_Mode);
var setMode = defineSetterFunction(SYM_Mode);
var getTask = defineGetterFunction(SYM_Task);
var setTask = defineSetterFunction(SYM_Task);
var getIsRunning = defineGetterFunction(SYM_IsRunning);
var setIsRunning = defineSetterFunction(SYM_IsRunning);
var getIsCancelled = defineGetterFunction(SYM_IsCancelled);
var setIsCancelled = defineSetterFunction(SYM_IsCancelled);
var getId = defineGetterFunction(SYM_Id);
var setId = defineSetterFunction(SYM_Id);
var getContext = defineGetterFunction(SYM_Context);
var setContext = defineSetterFunction(SYM_Context);
var getPromise = defineGetterFunction(SYM_Promise);
var setPromise = defineSetterFunction(SYM_Promise);
var getGenerator = defineGetterFunction(SYM_Generator);
var setGenerator = defineSetterFunction(SYM_Generator);
var getOperations = defineGetterFunction(SYM_Operations);
var setOperations = defineSetterFunction(SYM_Operations);
var getIterator = defineGetterFunction(SYM_Iterator);
var setIterator = defineSetterFunction(SYM_Iterator);
var isNotCancelled = pipeline_default(isCancelled, not_default);
var isRunningAndNotCancelled = pipeline_default(both(isRunning, isNotCancelled));
var getRunningOperations = pipeline_default(getOperations, filter(isRunning));
var getCurrentOperation = pipeline_default(getRunningOperations, first_default);
var isTaskRunning = pipeline_default(getRunningOperations, map(isRunningAndNotCancelled), any);
var isTaskNotRunning = pipeline_default(isTaskRunning, not_default);
var isOperationRunning = pipeline_default(getIsRunning, eq(true));
var isTaskCancelled = pipeline_default(getIsCancelled, eq(true));
var isOperationCancelled = pipeline_default(getIsCancelled, eq(true));
var cancelOperation = pipeline_default(curry(setIsCancelled, true), getPromise);
var cancelOperations = pipeline_default(getOperations, map(cancelOperation));
var isNotRunning = pipeline_default(isRunning, not_default);
var getNextOperations = pipeline_default(getOperations, filter(isNotRunning), filter(isNotCancelled));
var getNextOperation = pipeline_default(getNextOperations, first_default);
var hasNextOperation = pipeline_default(getNextOperation, isNone, not_default);
var runNextOperation = pipeline_default(getNextOperation, conditional(isNone, NOOP, perform));
var getTaskAndRunNextOperation = pipeline_default(getTask, curry(setIsRunning, false), runNextOperation);
var cleanAfterRun = pipeline_default(curry(setIsRunning, false), getTaskAndRunNextOperation);
var performOperation = pipeline_default(curry(setIsRunning, true), (operation) => {
  return stepOperation(operation).then((value) => {
    cleanAfterRun(operation);
    return value;
  });
});
var Task = class {
  constructor({ generator, context, mode, idProvider }) {
    setId(this, (idProvider || taskIdGen).next().value);
    setGenerator(this, generator);
    setContext(this, context);
    setOperations(this, []);
    setMode(this, mode || "drop");
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
};
var Operation = class {
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
};
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
    case "drop":
      return performTaskInModeDrop(task, ...state);
    case "restart":
      return performTaskInModeRestart(task, ...state);
    case "keepLatest":
      return performTaskInModeKeepLatest(task, ...state);
    case "enqueue":
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
  if (pipe(task, hasNextOperation, not_default)) {
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
  const newOperations = pipe(operations, filter((op) => {
    return getId(op) !== operationId;
  }));
  setOperations(task, newOperations);
}
function stepOperation(operation, current) {
  const task = getTask(operation);
  const iterator = getIterator(operation);
  if (isCancelled(operation)) {
    return stepOperationIfCancelled(task, operation, current);
  }
  const item = iterator.next(current);
  const { done, value } = item;
  if (done) {
    return stepOperationIfDone(task, operation, value);
  }
  return stepOperationWithPromise(task, operation, new Promise((resolve, reject2) => {
    setImmediate(async () => {
      const nextValue = isPromise(value) ? await value : value;
      stepOperation(operation, nextValue).then(resolve, reject2);
    });
  }));
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

// src/utils/test.js
function _test(string, regex) {
  return regex.test(string);
}
function test(string, regex) {
  if (arguments.lentesth === 1) {
    return curry(_test, string);
  }
  return _test(string, regex);
}

// src/utils/trim.js
function trim(target) {
  return target.trim();
}

// src/utils/truncate.js
var truncateToLastSpace = pipeline_default(({ string, maxLength }) => {
  const lastCharMatch = pipe(string, slice(0, maxLength), match(/( )\b(\w+)$/u));
  return conditional(lastCharMatch, isNone, () => {
    return slice(string, 0, maxLength - 1);
  }, () => {
    return slice(string, 0, lastCharMatch.index);
  });
}, append("\u2026"));
function _truncate(string, maxLength) {
  if (is_empty_default(string)) {
    return "";
  }
  return pipe(length(string || ""), conditional(gt(maxLength), truncateToLastSpace({ string, maxLength }), string));
}
function truncate(string, maxLength) {
  if (arguments.length === 1) {
    return curry(_truncate, string);
  }
  return _truncate(string, maxLength);
}

// src/utils/uniq.js
function IDENTITY_FN(a) {
  return a;
}
function _uniq(list, fn = IDENTITY_FN) {
  if (is_empty_default(list)) {
    return [];
  }
  return map([...new Set(map(list, fn))], (k) => {
    return find(list, (el) => {
      return fn(el) === k;
    });
  });
}
function uniq(list, fn = IDENTITY_FN) {
  if (arguments.length === 1 && isFunction(list)) {
    return curry(_uniq, list);
  }
  return _uniq(list, fn);
}

// src/utils/values.js
var values_default = Object.values;

// src/utils/wrap-with-array.js
var wrap_with_array_default = conditional(isArray, (e) => {
  return e;
}, (e) => {
  return [e];
});

// src/index.js
var src_default = {
  allWith,
  all,
  anyWith: allWith2,
  any,
  append,
  both,
  chunk,
  compact: compact_default,
  concat,
  conditional,
  createTask: _createTask,
  cancelTask: _cancelTask,
  curry,
  debug: debug_default,
  entries: entries_default,
  eq,
  exec,
  extend,
  filterBy,
  filter,
  findByInTree,
  findBy,
  findInTree,
  find,
  first: first_default,
  flatten: flatten_default,
  forEach: for_each_default,
  groupBy,
  gt,
  gte: gt2,
  id: identity,
  includes,
  injectPipelineIf,
  injectPipeline,
  instantiate,
  isArrayEmpty,
  isArray,
  isEmpty: is_empty_default,
  isFunction,
  isNone,
  isNumber,
  isObject,
  isObjectEmpty,
  isPromise,
  isStringEmpty,
  isString,
  join,
  keyMap: key_map_default,
  keys: keys_default,
  last: last_default,
  length,
  log: log_default,
  logger: logger_default,
  lt,
  lte,
  mapBy,
  map,
  match,
  merge,
  neq,
  notEmpty,
  not: not_default,
  ownProperties: own_properties_default,
  parse: parse_default,
  pipe,
  pipelineTransformation,
  pipeline: pipeline_default,
  pluck: pluck_default,
  proxy,
  range,
  recursive,
  reduce,
  rejectBy,
  reject,
  replace,
  returnNull: return_null_default,
  returnValue: return_value_default,
  sampleMany,
  sample,
  sleep,
  slice,
  sortBy: sort_by_default,
  sort: sort_default,
  split,
  stringify: stringify_default,
  test,
  toObject,
  trim,
  truncate,
  uniq,
  values: values_default,
  wrapWithArray: wrap_with_array_default
};
export {
  all,
  allWith,
  any,
  allWith2 as anyWith,
  append,
  both,
  _cancelTask as cancelTask,
  chunk,
  compact_default as compact,
  concat,
  conditional,
  _createTask as createTask,
  curry,
  debug_default as debug,
  src_default as default,
  entries_default as entries,
  eq,
  exec,
  extend,
  filter,
  filterBy,
  find,
  findBy,
  findByInTree,
  findInTree,
  first_default as first,
  flatten_default as flatten,
  for_each_default as forEach,
  groupBy,
  gt,
  gt2 as gte,
  identity as id,
  includes,
  injectPipeline,
  injectPipelineIf,
  instantiate,
  isArray,
  isArrayEmpty,
  is_empty_default as isEmpty,
  isFunction,
  isNone,
  isNumber,
  isObject,
  isObjectEmpty,
  isPromise,
  isString,
  isStringEmpty,
  join,
  key_map_default as keyMap,
  keys_default as keys,
  last_default as last,
  length,
  log_default as log,
  logger_default as logger,
  lt,
  lte,
  map,
  mapBy,
  match,
  merge,
  neq,
  not_default as not,
  notEmpty,
  own_properties_default as ownProperties,
  parse_default as parse,
  pipe,
  pipeline_default as pipeline,
  pipelineTransformation,
  pluck_default as pluck,
  proxy,
  range,
  recursive,
  reduce,
  reject,
  rejectBy,
  replace,
  return_null_default as returnNull,
  return_value_default as returnValue,
  sample,
  sampleMany,
  sleep,
  slice,
  sort_default as sort,
  sort_by_default as sortBy,
  split,
  stringify_default as stringify,
  test,
  toObject,
  trim,
  truncate,
  uniq,
  values_default as values,
  wrap_with_array_default as wrapWithArray
};
