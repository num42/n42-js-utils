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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL3V0aWxzL2lzLWZ1bmN0aW9uLmpzIiwgIi4uL3NyYy91dGlscy9pcy1hcnJheS5qcyIsICIuLi9zcmMvdXRpbHMvaXMtbm9uZS5qcyIsICIuLi9zcmMvdXRpbHMvY3VycnkuanMiLCAiLi4vc3JjL3V0aWxzL21hcC5qcyIsICIuLi9zcmMvdXRpbHMvc2xpY2UuanMiLCAiLi4vc3JjL3V0aWxzL3JlY3Vyc2l2ZS5qcyIsICIuLi9zcmMvdXRpbHMvaXMtYXJyYXktZW1wdHkuanMiLCAiLi4vc3JjL3V0aWxzL3BpcGUuanMiLCAiLi4vc3JjL3V0aWxzL3JlZHVjZS5qcyIsICIuLi9zcmMvdXRpbHMvdG8tb2JqZWN0LmpzIiwgIi4uL3NyYy91dGlscy9rZXktbWFwLmpzIiwgIi4uL3NyYy91dGlscy9hbGwtd2l0aC5qcyIsICIuLi9zcmMvdXRpbHMvYWxsLmpzIiwgIi4uL3NyYy91dGlscy9hbnktd2l0aC5qcyIsICIuLi9zcmMvdXRpbHMvYW55LmpzIiwgIi4uL3NyYy91dGlscy9jb25jYXQuanMiLCAiLi4vc3JjL3V0aWxzL2lzLXN0cmluZy5qcyIsICIuLi9zcmMvdXRpbHMvYXBwZW5kLmpzIiwgIi4uL3NyYy91dGlscy9ib3RoLmpzIiwgIi4uL3NyYy91dGlscy9jaHVuay5qcyIsICIuLi9zcmMvdXRpbHMvZmlsdGVyLmpzIiwgIi4uL3NyYy91dGlscy9pcy1zdHJpbmctZW1wdHkuanMiLCAiLi4vc3JjL3V0aWxzL2lzLWVtcHR5LmpzIiwgIi4uL3NyYy91dGlscy9ub3QtZW1wdHkuanMiLCAiLi4vc3JjL3V0aWxzL2NvbXBhY3QuanMiLCAiLi4vc3JjL3V0aWxzL2NvbmRpdGlvbmFsLmpzIiwgIi4uL3NyYy91dGlscy9waXBlbGluZS10cmFuc2Zvcm1hdGlvbi5qcyIsICIuLi9zcmMvdXRpbHMvZGVidWcuanMiLCAiLi4vc3JjL3V0aWxzL2VudHJpZXMuanMiLCAiLi4vc3JjL3V0aWxzL2VxLmpzIiwgIi4uL3NyYy91dGlscy9leGVjLmpzIiwgIi4uL3NyYy91dGlscy9vd24tcHJvcGVydGllcy5qcyIsICIuLi9zcmMvdXRpbHMvZXh0ZW5kLmpzIiwgIi4uL3NyYy91dGlscy9waXBlbGluZS5qcyIsICIuLi9zcmMvdXRpbHMvZmlsdGVyLWJ5LmpzIiwgIi4uL3NyYy91dGlscy9maW5kLWluLXRyZWUuanMiLCAiLi4vc3JjL3V0aWxzL2ZpbmQtYnktaW4tdHJlZS5qcyIsICIuLi9zcmMvdXRpbHMvZmluZC5qcyIsICIuLi9zcmMvdXRpbHMvZmluZC1ieS5qcyIsICIuLi9zcmMvdXRpbHMvZmlyc3QuanMiLCAiLi4vc3JjL3V0aWxzL2ZsYXR0ZW4uanMiLCAiLi4vc3JjL3V0aWxzL2Zvci1lYWNoLmpzIiwgIi4uL3NyYy91dGlscy9ncm91cC1ieS5qcyIsICIuLi9zcmMvdXRpbHMvZ3QuanMiLCAiLi4vc3JjL3V0aWxzL2d0ZS5qcyIsICIuLi9zcmMvdXRpbHMvaWQuanMiLCAiLi4vc3JjL3V0aWxzL2luY2x1ZGVzLmpzIiwgIi4uL3NyYy91dGlscy9pbmplY3QtcGlwZWxpbmUtaWYuanMiLCAiLi4vc3JjL3V0aWxzL2luamVjdC1waXBlbGluZS5qcyIsICIuLi9zcmMvdXRpbHMvbGVuZ3RoLmpzIiwgIi4uL3NyYy91dGlscy9pbnN0YW50aWF0ZS5qcyIsICIuLi9zcmMvdXRpbHMvaXMtbnVtYmVyLmpzIiwgIi4uL3NyYy91dGlscy9pcy1vYmplY3QuanMiLCAiLi4vc3JjL3V0aWxzL2lzLW9iamVjdC1lbXB0eS5qcyIsICIuLi9zcmMvdXRpbHMvaXMtcHJvbWlzZS5qcyIsICIuLi9zcmMvdXRpbHMvam9pbi5qcyIsICIuLi9zcmMvdXRpbHMva2V5cy5qcyIsICIuLi9zcmMvdXRpbHMvbGFzdC5qcyIsICIuLi9zcmMvdXRpbHMvbG9nLmpzIiwgIi4uL3NyYy91dGlscy9sb2dnZXIuanMiLCAiLi4vc3JjL3V0aWxzL2x0LmpzIiwgIi4uL3NyYy91dGlscy9sdGUuanMiLCAiLi4vc3JjL3V0aWxzL21hcC1ieS5qcyIsICIuLi9zcmMvdXRpbHMvbWF0Y2guanMiLCAiLi4vc3JjL3V0aWxzL21lcmdlLmpzIiwgIi4uL3NyYy91dGlscy9uZXEuanMiLCAiLi4vc3JjL3V0aWxzL25vdC5qcyIsICIuLi9zcmMvdXRpbHMvcGFyc2UuanMiLCAiLi4vc3JjL3V0aWxzL3BsdWNrLmpzIiwgIi4uL3NyYy91dGlscy9wcm94eS5qcyIsICIuLi9zcmMvdXRpbHMvcmFuZ2UuanMiLCAiLi4vc3JjL3V0aWxzL3JlamVjdC5qcyIsICIuLi9zcmMvdXRpbHMvcmVqZWN0LWJ5LmpzIiwgIi4uL3NyYy91dGlscy9yZXBsYWNlLmpzIiwgIi4uL3NyYy91dGlscy9yZXR1cm4tbnVsbC5qcyIsICIuLi9zcmMvdXRpbHMvcmV0dXJuLXZhbHVlLmpzIiwgIi4uL3NyYy91dGlscy9zb3J0LmpzIiwgIi4uL3NyYy91dGlscy9zYW1wbGUtbWFueS5qcyIsICIuLi9zcmMvdXRpbHMvc2FtcGxlLmpzIiwgIi4uL3NyYy91dGlscy9zbGVlcC5qcyIsICIuLi9zcmMvdXRpbHMvc29ydC1ieS5qcyIsICIuLi9zcmMvdXRpbHMvc3BsaXQuanMiLCAiLi4vc3JjL3V0aWxzL3N0cmluZ2lmeS5qcyIsICIuLi9zcmMvdXRpbHMvdGFzay5qcyIsICIuLi9zcmMvdXRpbHMvdGVzdC5qcyIsICIuLi9zcmMvdXRpbHMvdHJpbS5qcyIsICIuLi9zcmMvdXRpbHMvdHJ1bmNhdGUuanMiLCAiLi4vc3JjL3V0aWxzL3VuaXEuanMiLCAiLi4vc3JjL3V0aWxzL3ZhbHVlcy5qcyIsICIuLi9zcmMvdXRpbHMvd3JhcC13aXRoLWFycmF5LmpzIiwgIi4uL3NyYy9pbmRleC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNGdW5jdGlvbihmbikge1xuICByZXR1cm4gZm4gJiYge30udG9TdHJpbmcuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNBcnJheSh0YXJnZXQpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodGFyZ2V0KTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc05vbmUodmFsdWUpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmaW5lZFxuICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjdXJyeShmbiwgLi4uYXJncykge1xuICByZXR1cm4gKGEpID0+IHtcbiAgICByZXR1cm4gZm4oYSwgLi4uYXJncyk7XG4gIH07XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pcy1mdW5jdGlvbi5qcyc7XG5cbmZ1bmN0aW9uIF9tYXAobGlzdCwgZm4pIHtcbiAgaWYgKGlzRnVuY3Rpb24obGlzdC5tYXApKSB7XG4gICAgcmV0dXJuIGxpc3QubWFwKGZuKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShsaXN0KS5tYXAoZm4pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXAobGlzdCwgZm4pIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX21hcCwgbGlzdCk7XG4gIH1cbiAgcmV0dXJuIF9tYXAobGlzdCwgZm4pO1xufVxuIiwgImltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gX3NsaWNlKHNsaWNhYmxlLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBpc05vbmUoZW5kKSA/IHNsaWNhYmxlLnNsaWNlKHN0YXJ0KSA6IHNsaWNhYmxlLnNsaWNlKHN0YXJ0LCBlbmQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzbGljZShzbGljYWJsZSwgc3RhcnQsIGVuZCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfc2xpY2UsIHNsaWNhYmxlKTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBjdXJyeShfc2xpY2UsIHNsaWNhYmxlLCBzdGFydCk7XG4gIH1cbiAgcmV0dXJuIF9zbGljZShzbGljYWJsZSwgc3RhcnQsIGVuZCk7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG4vLyByZWN1cnNpdmUgaW1wbGVtZW50YXRpb24uIGJlYXV0aWZ1bCBhbmQgd29ya3MsIGJ1dCBpcyBub3QgYXMgcGVyZm9ybWFudFxuLy8gY29uc3QgX3JlY3Vyc2l2ZSA9IChhcnIsIHN0b3BDb25kaXRpb24sIGZuLCBhY2N1bXVsYXRvcik9Pntcbi8vICAgaWYoc3RvcENvbmRpdGlvbihhcnIsIGFjY3VtdWxhdG9yKSl7cmV0dXJuIGFjY3VtdWxhdG9yfVxuLy8gICBjb25zdCB7bmV4dCwgY3VycmVudH0gPSBmbihhcnIsIGFjY3VtdWxhdG9yKVxuLy8gICByZXR1cm4gX3JlY3Vyc2l2ZShuZXh0LCBzdG9wQ29uZGl0aW9uLCBmbiwgY3VycmVudClcbi8vIH1cblxuLy8gdW53cmFwcGVkIHJlY3Vyc2l2ZSB0byBpbXByb3ZlIHBlcmZvcm1hbmNlIGJ5IG5vdCBidWlsZGluZyBhIGdpYW50IHN0YWNrLlxuZnVuY3Rpb24gX3JlY3Vyc2l2ZShhcnIsIHN0b3BDb25kaXRpb24sIGZuLCBhY2N1bXVsYXRvcikge1xuICBsZXQgZGF0YSA9IGFycjtcbiAgbGV0IGFjYyA9IGFjY3VtdWxhdG9yO1xuICBsZXQgc3RvcHBlZCA9IHN0b3BDb25kaXRpb24oZGF0YSwgYWNjKTtcblxuICB3aGlsZSAoIXN0b3BwZWQpIHtcbiAgICBjb25zdCB7IGN1cnJlbnQsIG5leHQgfSA9IGZuKGFjYywgZGF0YSk7XG4gICAgYWNjID0gY3VycmVudDtcbiAgICBkYXRhID0gbmV4dDtcbiAgICBzdG9wcGVkID0gc3RvcENvbmRpdGlvbihkYXRhLCBhY2MpO1xuICB9XG5cbiAgcmV0dXJuIGFjYztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjdXJzaXZlKGFyciwgZm4sIHN0b3BDb25kaXRpb24sIGFjY3VtdWxhdG9yKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9yZWN1cnNpdmUsIGFyciwgZm4sIHN0b3BDb25kaXRpb24pO1xuICB9XG4gIHJldHVybiBfcmVjdXJzaXZlKGFyciwgZm4sIHN0b3BDb25kaXRpb24sIGFjY3VtdWxhdG9yKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc0FycmF5RW1wdHkoYXJyKSB7XG4gIHJldHVybiBhcnIubGVuZ3RoIDw9IDA7XG59XG4iLCAiaW1wb3J0IHNsaWNlIGZyb20gJy4vc2xpY2UuanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZSBmcm9tICcuL3JlY3Vyc2l2ZS5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCBpc0FycmF5RW1wdHkgZnJvbSAnLi9pcy1hcnJheS1lbXB0eS5qcyc7XG5cbmZ1bmN0aW9uIF9waXBlTWl4ZWQoZGF0YSwgb3BzKSB7XG4gIHJldHVybiByZWN1cnNpdmUoXG4gICAgLy8gaW5pdGlhbCB2YWx1ZVxuICAgIG9wcyxcblxuICAgIC8vIGV4aXQgd2hlbiBubyBvcGVyYXRpb25zIGFyZSBsZWZ0IHRvIHBlcmZvcm1cbiAgICAob3BlcmF0aW9ucykgPT4ge1xuICAgICAgcmV0dXJuIGlzQXJyYXlFbXB0eShvcGVyYXRpb25zKTtcbiAgICB9LFxuXG4gICAgLy8gcHJvY2VzcyBkYXRhXG4gICAgLy8gTk9URTogd2Ugc3dpdGNoZXJvbyBhY2N1bXVsYXRvciBhbmQgZGF0YSBoZXJlLCBiZWNhdXNlIHRoZSBkYXRhIGluIGFcbiAgICAvLyBzdHJlYW0gaXMgdGhlIGFjY3VtdWxhdG9yIDopXG4gICAgLy8gZmlyc3Qgb3BlcmF0aW9uIG1heSBiZSBhbiBmdW5jdGlvbiBvciBvYmplY3QgY29udGFpbmluZyBhbiBleGVjIGZ1bmN0aW9uXG4gICAgLy8gcGFzc2luZyBpbiBhbiBvYmplY3QgYWxsb3dzIGZvciB0cmFuc211dGluZyB0aGUgcGlwZWxpbmUuXG4gICAgKG9wZXJhdGlvbnMsIGN1cnJlbnREYXRhKSA9PiB7XG4gICAgICBjb25zdCBvcGVyYXRpb24gPSBvcGVyYXRpb25zWzBdO1xuICAgICAgY29uc3QgbmV4dCA9IHNsaWNlKG9wZXJhdGlvbnMsIDEsIG51bGwpO1xuXG4gICAgICBpZiAoaXNGdW5jdGlvbihvcGVyYXRpb24pKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBvcGVyYXRpb24oY3VycmVudERhdGEpO1xuICAgICAgICByZXR1cm4geyBuZXh0LCBjdXJyZW50IH07XG4gICAgICB9XG4gICAgICByZXR1cm4gb3BlcmF0aW9uLmV4ZWMoY3VycmVudERhdGEsIG5leHQpO1xuICAgIH0sXG5cbiAgICAvLyBBY2N1bXVsYXRlIGRhdGFcbiAgICBkYXRhXG4gICk7XG59XG5cbmZ1bmN0aW9uIF9waXBlUHVyZShkYXRhLCBvcGVyYXRpb25zKSB7XG4gIHJldHVybiBvcGVyYXRpb25zLnJlZHVjZSgoYWNjLCBvcGVyYXRpb24pID0+IHtcbiAgICByZXR1cm4gb3BlcmF0aW9uKGFjYyk7XG4gIH0sIGRhdGEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwaXBlKGRhdGEsIC4uLm9wZXJhdGlvbnMpIHtcbiAgLy8gaWYgYWxsIG9wZXJhdGlvbnMgYXJlIGZ1bmN0aW9ucywgd2UgY2FuIHVzZSB0aGUgb3B0aW1pemVkIHBpcGUgZnVuY3Rpb25cbiAgaWYgKFxuICAgIG9wZXJhdGlvbnMucmVkdWNlKChhY2MsIG9wZXJhdGlvbikgPT4ge1xuICAgICAgcmV0dXJuIGFjYyAmJiBpc0Z1bmN0aW9uKG9wZXJhdGlvbik7XG4gICAgfSwgdHJ1ZSlcbiAgKSB7XG4gICAgcmV0dXJuIF9waXBlUHVyZShkYXRhLCBvcGVyYXRpb25zKTtcbiAgfVxuICByZXR1cm4gX3BpcGVNaXhlZChkYXRhLCBvcGVyYXRpb25zKTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcblxuY29uc3QgX3JlZHVjZSA9IChsaXN0LCBmbiwgaW5pdGlhbCkgPT4ge1xuICBpZiAoaXNGdW5jdGlvbihsaXN0LnJlZHVjZSkpIHtcbiAgICByZXR1cm4gbGlzdC5yZWR1Y2UoZm4sIGluaXRpYWwpO1xuICB9XG4gIHJldHVybiBBcnJheS5mcm9tKGxpc3QpLnJlZHVjZShmbiwgaW5pdGlhbCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWR1Y2UobGlzdCwgZm4sIGluaXRpYWwpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX3JlZHVjZSwgbGlzdCwgbnVsbCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX3JlZHVjZSwgbGlzdCwgZm4pO1xuICB9XG4gIHJldHVybiBfcmVkdWNlKGxpc3QsIGZuLCBpbml0aWFsKTtcbn1cbiIsICJpbXBvcnQgcmVkdWNlIGZyb20gJy4vcmVkdWNlLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9PYmplY3QobGlzdCkge1xuICByZXR1cm4gcmVkdWNlKFxuICAgIGxpc3QsXG4gICAgKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LFxuICAgIHt9XG4gICk7XG59XG4iLCAiaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pcy1mdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzLWFycmF5LmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcbmltcG9ydCBtYXAgZnJvbSAnLi9tYXAuanMnO1xuaW1wb3J0IHBpcGUgZnJvbSAnLi9waXBlLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcbmltcG9ydCB0b09iamVjdCBmcm9tICcuL3RvLW9iamVjdC5qcyc7XG5cbmZ1bmN0aW9uIGV4dHJhY3RWYWx1ZShrZXksIG9iaikge1xuICBpZiAoaXNOb25lKG9iaikpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoIShrZXkgaW4gb2JqKSkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChpc0Z1bmN0aW9uKG9ialtrZXldKSkge1xuICAgIHJldHVybiBvYmpba2V5XSgpO1xuICB9XG4gIHJldHVybiBvYmpba2V5XTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFNpbmdsZVZhbHVlKGtleSkge1xuICByZXR1cm4gKG9iaikgPT4ge1xuICAgIHJldHVybiBleHRyYWN0VmFsdWUoa2V5LCBvYmopO1xuICB9O1xufVxuXG5mdW5jdGlvbiBleHRyYWN0TXVsdGlwbGVWYWx1ZXMoa2V5cykge1xuICByZXR1cm4gKG9iaikgPT4ge1xuICAgIHJldHVybiBwaXBlKG9iaiwga2V5cywgbWFwKGN1cnJ5KGV4dHJhY3RWYWx1ZSwgb2JqKSksIHRvT2JqZWN0KTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGtleXMpIHtcbiAgaWYgKGlzQXJyYXkoa2V5cykpIHtcbiAgICByZXR1cm4gZXh0cmFjdE11bHRpcGxlVmFsdWVzKGtleXMpO1xuICB9XG4gIHJldHVybiBleHRyYWN0U2luZ2xlVmFsdWUoa2V5cyk7XG59XG4iLCAiaW1wb3J0IGtleU1hcCBmcm9tICcuL2tleS1tYXAuanMnO1xuaW1wb3J0IHJlZHVjZSBmcm9tICcuL3JlZHVjZS5qcyc7XG5pbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9hbGxXaXRoKGxpc3QsIGtleSwgdGFyZ2V0KSB7XG4gIGNvbnN0IGttID0ga2V5TWFwKGtleSk7XG4gIGNvbnN0IGNoZWNrZXIgPVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMlxuICAgICAgPyAodmFsdWUpID0+IHtcbiAgICAgICAgICByZXR1cm4ga2V5IGluIHZhbHVlO1xuICAgICAgICB9XG4gICAgICA6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBrbSh2YWx1ZSkgPT09IHRhcmdldDtcbiAgICAgICAgfTtcbiAgcmV0dXJuIHJlZHVjZShcbiAgICBsaXN0LFxuICAgIChhY2MsIHYpID0+IHtcbiAgICAgIHJldHVybiBhY2MgJiYgY2hlY2tlcih2KTtcbiAgICB9LFxuICAgIHRydWVcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWxsV2l0aChsaXN0LCBrZXksIHZhbHVlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9hbGxXaXRoLCBsaXN0KTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBjdXJyeShfYWxsV2l0aCwgbGlzdCwga2V5KTtcbiAgfVxuICByZXR1cm4gX2FsbFdpdGgobGlzdCwga2V5LCB2YWx1ZSk7XG59XG4iLCAiaW1wb3J0IHJlZHVjZSBmcm9tICcuL3JlZHVjZS5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFsbChsaXN0KSB7XG4gIHJldHVybiByZWR1Y2UoXG4gICAgbGlzdCxcbiAgICAoYWNjLCB2KSA9PiB7XG4gICAgICByZXR1cm4gYWNjICYmIHY7XG4gICAgfSxcbiAgICB0cnVlXG4gICk7XG59XG4iLCAiaW1wb3J0IGtleU1hcCBmcm9tICcuL2tleS1tYXAuanMnO1xuaW1wb3J0IHJlZHVjZSBmcm9tICcuL3JlZHVjZS5qcyc7XG5pbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9hbnlXaXRoKGxpc3QsIGtleSwgdGFyZ2V0KSB7XG4gIGNvbnN0IGttID0ga2V5TWFwKGtleSk7XG4gIGNvbnN0IGNoZWNrZXIgPVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMlxuICAgICAgPyAodmFsdWUpID0+IHtcbiAgICAgICAgICByZXR1cm4ga2V5IGluIHZhbHVlO1xuICAgICAgICB9XG4gICAgICA6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBrbSh2YWx1ZSkgPT09IHRhcmdldDtcbiAgICAgICAgfTtcbiAgcmV0dXJuIHJlZHVjZShcbiAgICBsaXN0LFxuICAgIChhY2MsIHYpID0+IHtcbiAgICAgIHJldHVybiBhY2MgfHwgY2hlY2tlcih2KTtcbiAgICB9LFxuICAgIGZhbHNlXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFsbFdpdGgobGlzdCwga2V5LCB2YWx1ZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfYW55V2l0aCwgbGlzdCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX2FueVdpdGgsIGxpc3QsIGtleSk7XG4gIH1cbiAgcmV0dXJuIF9hbnlXaXRoKGxpc3QsIGtleSwgdmFsdWUpO1xufVxuIiwgImltcG9ydCByZWR1Y2UgZnJvbSAnLi9yZWR1Y2UuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhbnkobGlzdCkge1xuICByZXR1cm4gcmVkdWNlKFxuICAgIGxpc3QsXG4gICAgKGFjYywgdikgPT4ge1xuICAgICAgcmV0dXJuIGFjYyB8fCB2O1xuICAgIH0sXG4gICAgZmFsc2VcbiAgKTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9jb25jYXQoYXJyMSwgYXJyMikge1xuICByZXR1cm4gYXJyMS5jb25jYXQoYXJyMik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmNhdChhcnIsIGFtb3VudCkge1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfY29uY2F0LCBhcnIpO1xuICB9XG4gIHJldHVybiBfY29uY2F0KGFyciwgYW1vdW50KTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQgY29uY2F0IGZyb20gJy4vY29uY2F0LmpzJztcbmltcG9ydCBpc1N0cmluZyBmcm9tICcuL2lzLXN0cmluZy5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL2lzLWFycmF5LmpzJztcblxuZnVuY3Rpb24gX2FwcGVuZChhLCBiKSB7XG4gIGlmIChpc1N0cmluZyhhKSkge1xuICAgIHJldHVybiBgJHthfSR7Yn1gO1xuICB9XG4gIGlmIChpc0FycmF5KGEpKSB7XG4gICAgcmV0dXJuIGNvbmNhdChhLCBbYl0pO1xuICB9XG4gIC8vIFRPRE8oYXNvbCk6IGlmIGlzT2JqZWN0IG1lcmdlP1xuICByZXR1cm4gU3RyaW5nKGEpICsgYjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwZW5kKGEsIGIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2FwcGVuZCwgYSk7XG4gIH1cbiAgcmV0dXJuIF9hcHBlbmQoYSwgYik7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfYm90aChpbnB1dCwgY29uZGl0aW9uMSwgY29uZGl0aW9uMikge1xuICByZXR1cm4gY29uZGl0aW9uMShpbnB1dCkgJiYgY29uZGl0aW9uMihpbnB1dCk7XG59XG5cbmZ1bmN0aW9uIGVxdChhKSB7XG4gIHJldHVybiBhID09PSB0cnVlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBib3RoKGlucHV0LCBjb25kaXRpb24xLCBjb25kaXRpb24yKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIF9ib3RoKGlucHV0LCBlcXQsIGVxdCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX2JvdGgsIGlucHV0LCBjb25kaXRpb24xKTtcbiAgfVxuICByZXR1cm4gYm90aChpbnB1dCwgY29uZGl0aW9uMSwgY29uZGl0aW9uMik7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZSBmcm9tICcuL3JlY3Vyc2l2ZS5qcyc7XG5pbXBvcnQgaXNBcnJheUVtcHR5IGZyb20gJy4vaXMtYXJyYXktZW1wdHkuanMnO1xuaW1wb3J0IHNsaWNlIGZyb20gJy4vc2xpY2UuanMnO1xuaW1wb3J0IGNvbmNhdCBmcm9tICcuL2NvbmNhdC5qcyc7XG5cbmZ1bmN0aW9uIF9jaHVuayhpbnB1dEFycmF5LCBhbW91bnQpIHtcbiAgaWYgKGFtb3VudCA9PT0gMCkge1xuICAgIHJldHVybiBbaW5wdXRBcnJheV07XG4gIH1cbiAgaWYgKGlzQXJyYXlFbXB0eShpbnB1dEFycmF5KSkge1xuICAgIHJldHVybiBbW11dO1xuICB9XG4gIGNvbnN0IHN0b3BDb25kaXRpb24gPSAoYXJyKSA9PiB7XG4gICAgcmV0dXJuIGlzQXJyYXlFbXB0eShhcnIpO1xuICB9O1xuXG4gIGNvbnN0IHJlZHVjZXIgPSAoYWNjLCB2KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZmluZWRcbiAgICAgIG5leHQ6IHNsaWNlKHYsIGFtb3VudCwgdW5kZWZpbmVkKSxcbiAgICAgIGN1cnJlbnQ6IGNvbmNhdChhY2MsIFtzbGljZSh2LCAwLCBhbW91bnQpXSksXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gcmVjdXJzaXZlKGlucHV0QXJyYXksIHN0b3BDb25kaXRpb24sIHJlZHVjZXIsIFtdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2h1bmsoYXJyLCBhbW91bnQpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2NodW5rLCBhcnIpO1xuICB9XG4gIHJldHVybiBfY2h1bmsoYXJyLCBhbW91bnQpO1xufVxuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXMtZnVuY3Rpb24uanMnO1xuXG5jb25zdCBfZmlsdGVyID0gKGxpc3QsIGZuKSA9PiB7XG4gIGlmIChpc0Z1bmN0aW9uKGxpc3QuZmlsdGVyKSkge1xuICAgIHJldHVybiBsaXN0LmZpbHRlcihmbik7XG4gIH1cbiAgcmV0dXJuIEFycmF5LmZyb20obGlzdCkuZmlsdGVyKGZuKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbHRlcihsaXN0LCBmbikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfZmlsdGVyLCBsaXN0KTtcbiAgfVxuICByZXR1cm4gX2ZpbHRlcihsaXN0LCBmbik7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNTdHJpbmdFbXB0eSh2YWx1ZSkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHZhbHVlLnRyaW0oKS5sZW5ndGggPD0gMDtcbn1cbiIsICJjb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5O1xuXG5pbXBvcnQgaXNOb25lIGZyb20gJy4vaXMtbm9uZS5qcyc7XG5pbXBvcnQgaXNTdHJpbmcgZnJvbSAnLi9pcy1zdHJpbmcuanMnO1xuaW1wb3J0IGlzQXJyYXlFbXB0eSBmcm9tICcuL2lzLWFycmF5LWVtcHR5LmpzJztcbmltcG9ydCBpc1N0cmluZ0VtcHR5IGZyb20gJy4vaXMtc3RyaW5nLWVtcHR5LmpzJztcblxuZnVuY3Rpb24gaXNFbXB0eSh2KSB7XG4gIGlmIChpc05vbmUodikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2KSAmJiBpc0FycmF5RW1wdHkodikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNTdHJpbmcodikgJiYgaXNTdHJpbmdFbXB0eSh2KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaXNFbXB0eTtcbiIsICJpbXBvcnQgaXNFbXB0eSBmcm9tICcuL2lzLWVtcHR5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG5vdEVtcHR5KGspIHtcbiAgcmV0dXJuICFpc0VtcHR5KGspO1xufVxuIiwgImltcG9ydCBmaWx0ZXIgZnJvbSAnLi9maWx0ZXIuanMnO1xuaW1wb3J0IG5vdEVtcHR5IGZyb20gJy4vbm90LWVtcHR5LmpzJztcbmV4cG9ydCBkZWZhdWx0IGZpbHRlcihub3RFbXB0eSk7XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi9pcy1mdW5jdGlvbi5qcyc7XG5cbmZ1bmN0aW9uIF9jb25kaXRpb25hbChzdGF0ZSwgY29uZGl0aW9uRnVuY3Rpb24sIGNhc2UxLCBjYXNlMikge1xuICByZXR1cm4gY29uZGl0aW9uRnVuY3Rpb24oc3RhdGUpXG4gICAgPyBpc0Z1bmN0aW9uKGNhc2UxKVxuICAgICAgPyBjYXNlMShzdGF0ZSwgdHJ1ZSlcbiAgICAgIDogY2FzZTFcbiAgICA6IGlzRnVuY3Rpb24oY2FzZTIpXG4gICAgPyBjYXNlMihzdGF0ZSwgZmFsc2UpXG4gICAgOiBjYXNlMjtcbn1cblxuZnVuY3Rpb24gaWQoc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb25kaXRpb25hbChzdGF0ZSwgY29uZGl0aW9uRnVuY3Rpb24sIGNhc2UxLCBjYXNlMikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfY29uZGl0aW9uYWwsIHN0YXRlLCBpZCwgbnVsbCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX2NvbmRpdGlvbmFsLCBzdGF0ZSwgY29uZGl0aW9uRnVuY3Rpb24sIGlkKTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgIHJldHVybiBjdXJyeShfY29uZGl0aW9uYWwsIHN0YXRlLCBjb25kaXRpb25GdW5jdGlvbiwgY2FzZTEpO1xuICB9XG4gIHJldHVybiBfY29uZGl0aW9uYWwoc3RhdGUsIGNvbmRpdGlvbkZ1bmN0aW9uLCBjYXNlMSwgY2FzZTIpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBpcGVsaW5lVHJhbnNmb3JtYXRpb24oZm4sIGRhdGEpIHtcbiAgcmV0dXJuIHtcbiAgICBleGVjKGN1cnJlbnQsIG5leHRPcGVyYXRpb25zIC8qIGNhbGxiYWNrICovKSB7XG4gICAgICAvLyBUT0RPKGFzb2wpOiBpZiBjYWxsYmFjayB1c2UgY2FsbGJhY2sgaW5zdGVhZCBvZiByZXR1cm5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZuKG5leHRPcGVyYXRpb25zLCBjdXJyZW50LCBkYXRhKSxcbiAgICAgICAgY3VycmVudCxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbiBmcm9tICcuL3BpcGVsaW5lLXRyYW5zZm9ybWF0aW9uLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbigob3BlcmF0aW9ucywgY3VycmVudCkgPT4ge1xuICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBJbmZpbml0eTtcbiAgY29uc29sZS5pbmZvKGN1cnJlbnQpOyAvL2VzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICByZXR1cm4gb3BlcmF0aW9ucztcbn0pO1xuIiwgImV4cG9ydCBkZWZhdWx0IE9iamVjdC5lbnRyaWVzO1xuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gX2VxKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT09IGI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVxKGEsIGIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2VxLCBhKTtcbiAgfVxuICByZXR1cm4gX2VxKGEsIGIpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4ZWMoZm4sIGFyZ3MgPSBbXSkge1xuICByZXR1cm4gKHRhcmdldCkgPT4ge1xuICAgIHJldHVybiB0YXJnZXRbZm5dKC4uLmFyZ3MpO1xuICB9O1xufVxuIiwgImNvbnN0IHsga2V5cyB9ID0gT2JqZWN0O1xuZXhwb3J0IGRlZmF1bHQga2V5cztcbiIsICJpbXBvcnQgb3duUHJvcGVydGllcyBmcm9tICcuL293bi1wcm9wZXJ0aWVzLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXMtZnVuY3Rpb24uanMnO1xuaW1wb3J0IHJlZHVjZSBmcm9tICcuL3JlZHVjZS5qcyc7XG5pbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQgcGlwZSBmcm9tICcuL3BpcGUuanMnO1xuXG5mdW5jdGlvbiBfZXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XG4gIHJldHVybiBwaXBlKFxuICAgIHNvdXJjZSxcbiAgICBvd25Qcm9wZXJ0aWVzLFxuICAgIHJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgIGFjY1trZXldID0gaXNGdW5jdGlvbihzb3VyY2Vba2V5XSkgPyBzb3VyY2Vba2V5XS5iaW5kKGFjYykgOiBzb3VyY2Vba2V5XTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgdGFyZ2V0KVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2V4dGVuZCwgdGFyZ2V0KTtcbiAgfVxuICByZXR1cm4gX2V4dGVuZCh0YXJnZXQsIHNvdXJjZSk7XG59XG4iLCAiaW1wb3J0IHBpcGUgZnJvbSAnLi9waXBlLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgKC4uLm9wZXJhdGlvbnMpID0+IHtcbiAgcmV0dXJuIGN1cnJ5KHBpcGUsIC4uLm9wZXJhdGlvbnMpO1xufTtcbiIsICJpbXBvcnQga2V5TWFwIGZyb20gJy4va2V5LW1hcC5qcyc7XG5pbXBvcnQgZmlsdGVyIGZyb20gJy4vZmlsdGVyLmpzJztcbmltcG9ydCBwaXBlbGluZSBmcm9tICcuL3BpcGVsaW5lLmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXMtZnVuY3Rpb24uanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuXG5mdW5jdGlvbiBfZmlsdGVyQnkobGlzdCwga2V5LCB0YXJnZXQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gZmlsdGVyKGxpc3QsICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIGtleSBpbiB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuICBjb25zdCBrbSA9IGtleU1hcChrZXkpO1xuICBjb25zdCBjaGVja2VyID0gcGlwZWxpbmUoa20sIGlzRnVuY3Rpb24odGFyZ2V0KSA/IHRhcmdldCA6IGVxKHRhcmdldCkpO1xuICByZXR1cm4gZmlsdGVyKGxpc3QsIGNoZWNrZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaWx0ZXJCeShsaXN0LCBrZXksIHZhbHVlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9maWx0ZXJCeSwgbGlzdCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX2ZpbHRlckJ5LCBsaXN0LCBrZXkpO1xuICB9XG4gIHJldHVybiBfZmlsdGVyQnkobGlzdCwga2V5LCB2YWx1ZSk7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGtleU1hcCBmcm9tICcuL2tleS1tYXAuanMnO1xuaW1wb3J0IHBpcGUgZnJvbSAnLi9waXBlLmpzJztcbmltcG9ydCByZWR1Y2UgZnJvbSAnLi9yZWR1Y2UuanMnO1xuaW1wb3J0IGlzTm9uZSBmcm9tICcuL2lzLW5vbmUuanMnO1xuXG5mdW5jdGlvbiBfZmluZEluVHJlZShub2RlLCBmaW5kRm4sIG5leHROb2Rlc0ZuKSB7XG4gIGlmIChpc05vbmUobm9kZSkpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZmluZEZuKG5vZGUpKSB7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cbiAgcmV0dXJuIHBpcGUoXG4gICAgbm9kZSxcbiAgICBuZXh0Tm9kZXNGbixcbiAgICByZWR1Y2UoKGFjYywgbmV4dE5vZGUpID0+IHtcbiAgICAgIGlmIChhY2MpIHtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH1cbiAgICAgIHJldHVybiBfZmluZEluVHJlZShuZXh0Tm9kZSwgZmluZEZuLCBuZXh0Tm9kZXNGbik7XG4gICAgfSwgbnVsbClcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluZEluVHJlZShub2RlLCBmaW5kRm4sIG5leHROb2Rlc0ZuKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9maW5kSW5UcmVlLCBub2RlLCBrZXlNYXAoJ2NoaWxkcmVuJykpO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9maW5kSW5UcmVlLCBub2RlLCBmaW5kRm4pO1xuICB9XG4gIHJldHVybiBfZmluZEluVHJlZShub2RlLCBmaW5kRm4sIG5leHROb2Rlc0ZuKTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQga2V5TWFwIGZyb20gJy4va2V5LW1hcC5qcyc7XG5pbXBvcnQgZmluZEluVHJlZSBmcm9tICcuL2ZpbmQtaW4tdHJlZS5qcyc7XG5cbmZ1bmN0aW9uIF9maW5kQnlJblRyZWUobm9kZSwgdGFyZ2V0LCB2YWx1ZSwgbmV4dE5vZGVzRm4pIHtcbiAgY29uc3QgZmluZFZhbHVlID0ga2V5TWFwKHRhcmdldCk7XG4gIHJldHVybiBmaW5kSW5UcmVlKFxuICAgIG5vZGUsXG4gICAgKG4pID0+IHtcbiAgICAgIHJldHVybiBmaW5kVmFsdWUobikgPT09IHZhbHVlO1xuICAgIH0sXG4gICAgbmV4dE5vZGVzRm5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZmluZEJ5SW5UcmVlKG5vZGUsIHRhcmdldCwgdmFsdWUsIG5leHROb2Rlc0ZuKSB7XG4gIC8vIGZpbmQgbm9kZXMgaW4gdHJlZSB3aG9vc2UgdGFyZ2V0IGVxdWFscyB0cnVlLCBoYXZpbmcgY2hpbGRyZW5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2ZpbmRCeUluVHJlZSwgbm9kZSwgdHJ1ZSwga2V5TWFwKCdjaGlsZHJlbicpKTtcbiAgfVxuICAvLyBmaW5kIG5vZGVzIGluIHRyZWUgd2hvb3NlIHRhcmdldCBlcXVhbHMgdmFsdWUsIGhhdmluZyBjaGlsZHJlblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBjdXJyeShfZmluZEJ5SW5UcmVlLCBub2RlLCB0YXJnZXQsIGtleU1hcCgnY2hpbGRyZW4nKSk7XG4gIH1cbiAgLy8gZmluZCBub2RlXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9maW5kQnlJblRyZWUsIG5vZGUsIHRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIF9maW5kQnlJblRyZWUobm9kZSwgdGFyZ2V0LCB2YWx1ZSwgbmV4dE5vZGVzRm4pO1xufVxuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcbmltcG9ydCBpc0FycmF5RW1wdHkgZnJvbSAnLi9pcy1hcnJheS1lbXB0eS5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcblxuZnVuY3Rpb24gX2ZpbmQobGlzdCwgZmluZGVyRnVuY3Rpb24pIHtcbiAgaWYgKGlzTm9uZShsaXN0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChpc0FycmF5RW1wdHkobGlzdCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbihsaXN0LmZpbmQpKSB7XG4gICAgcmV0dXJuIGxpc3QuZmluZChmaW5kZXJGdW5jdGlvbikgfHwgbnVsbDtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShsaXN0KS5maW5kKGZpbmRlckZ1bmN0aW9uKSB8fCBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaW5kKGxpc3QsIGZpbmRlckZ1bmN0aW9uKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9maW5kLCBsaXN0KTtcbiAgfVxuICByZXR1cm4gX2ZpbmQobGlzdCwgZmluZGVyRnVuY3Rpb24pO1xufVxuIiwgImltcG9ydCBrZXlNYXAgZnJvbSAnLi9rZXktbWFwLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcbmltcG9ydCBmaW5kIGZyb20gJy4vZmluZC5qcyc7XG5cbmZ1bmN0aW9uIF9maW5kQnkobGlzdCwga2V5LCB0YXJnZXQpIHtcbiAgY29uc3QgbWFwcGVyID0ga2V5TWFwKGtleSk7XG4gIHJldHVybiBmaW5kKGxpc3QsICh2YWx1ZSkgPT4ge1xuICAgIHJldHVybiBtYXBwZXIodmFsdWUpID09PSB0YXJnZXQ7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaW5kQnkobGlzdCwga2V5LCB0YXJnZXQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2ZpbmRCeSwgbGlzdCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX2ZpbmRCeSwgbGlzdCwga2V5KTtcbiAgfVxuICByZXR1cm4gX2ZpbmRCeShsaXN0LCBrZXksIHRhcmdldCk7XG59XG4iLCAiaW1wb3J0IGlzQXJyYXlFbXB0eSBmcm9tICcuL2lzLWFycmF5LWVtcHR5LmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXMtZnVuY3Rpb24uanMnO1xuXG5leHBvcnQgZGVmYXVsdCAobGlzdCkgPT4ge1xuICBpZiAoaXNBcnJheUVtcHR5KGxpc3QpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24obGlzdC5nZXRJdGVtKSkge1xuICAgIHJldHVybiBsaXN0LmdldEl0ZW0oMCk7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24obGlzdC5vYmplY3RBdCkpIHtcbiAgICByZXR1cm4gbGlzdC5vYmplY3RBdCgwKTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbihsaXN0LmNoYXJBdCkpIHtcbiAgICByZXR1cm4gbGlzdC5jaGFyQXQoMCk7XG4gIH1cbiAgcmV0dXJuIGxpc3RbMF07XG59O1xuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhcnIsIGRlcHRoID0gSW5maW5pdHkpIHtcbiAgcmV0dXJuIGFyci5mbGF0KGRlcHRoKTtcbn1cbiIsICJpbXBvcnQgbWFwIGZyb20gJy4vbWFwLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgbWFwO1xuIiwgImltcG9ydCByZWR1Y2UgZnJvbSAnLi9yZWR1Y2UuanMnO1xuaW1wb3J0IGtleU1hcCBmcm9tICcuL2tleS1tYXAuanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfZ3JvdXBCeShhcnIsIGtleSkge1xuICBjb25zdCB2YWx1ZUZ1bmN0aW9uID0ga2V5TWFwKGtleSk7XG5cbiAgcmV0dXJuIHJlZHVjZShcbiAgICBhcnIsXG4gICAgKGFjYywgb2JqKSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSB2YWx1ZUZ1bmN0aW9uKG9iaik7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZpbmVkXG4gICAgICBpZiAoYWNjW3ZhbF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBhY2NbdmFsXSA9IFtdO1xuICAgICAgfVxuICAgICAgYWNjW3ZhbF0ucHVzaChvYmopO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LFxuICAgIHt9XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdyb3VwQnkoYXJyLCBrZXkpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2dyb3VwQnksIGFycik7XG4gIH1cbiAgcmV0dXJuIF9ncm91cEJ5KGFyciwga2V5KTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9ndChhLCBiKSB7XG4gIHJldHVybiBhID4gYjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ3QoYSwgYikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfZ3QsIGEpO1xuICB9XG4gIHJldHVybiBfZ3QoYSwgYik7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfZ3QoYSwgYikge1xuICByZXR1cm4gYSA+PSBiO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBndChhLCBiKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9ndCwgYSk7XG4gIH1cbiAgcmV0dXJuIF9ndChhLCBiKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpZGVudGl0eShzdGF0ZSkge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJy4vaXMtZW1wdHkuanMnO1xuaW1wb3J0IGlzTm9uZSBmcm9tICcuL2lzLW5vbmUuanMnO1xuaW1wb3J0IGZpbmQgZnJvbSAnLi9maW5kLmpzJztcbmltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcblxuZnVuY3Rpb24gX2luY2x1ZGVzKGluY2x1ZGVlLCB0YXJnZXQpIHtcbiAgaWYgKGlzRW1wdHkoaW5jbHVkZWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gdHJ5IG5hdGl2ZSBhcHByb2FjaCBmaXJzdFxuICBpZiAoaXNGdW5jdGlvbihpbmNsdWRlZS5pbmNsdWRlcykpIHtcbiAgICByZXR1cm4gaW5jbHVkZWUuaW5jbHVkZXModGFyZ2V0KTtcbiAgfVxuXG4gIC8vIGZhbGwgYmFjayB0byBmaW5kIG1ldGhvZC4gV2UgYXNzdW1lIHNvbWV0aGluZyBpbmNsdWRlcyBhIHRhcmdldCwgaWYgdGFyZ2V0XG4gIC8vIGNhbiBiZSBmb3VuZCB3aXRoaW4gc29tZXRoaW5nXG4gIGNvbnN0IGl0ZW0gPSBmaW5kKGluY2x1ZGVlLCBlcSh0YXJnZXQpKTtcbiAgcmV0dXJuICFpc05vbmUoaXRlbSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluY2x1ZGVzKGluY2x1ZGVlLCB0YXJnZXQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2luY2x1ZGVzLCBpbmNsdWRlZSk7XG4gIH1cbiAgcmV0dXJuIF9pbmNsdWRlcyhpbmNsdWRlZSwgdGFyZ2V0KTtcbn1cbiIsICJpbXBvcnQgcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbiBmcm9tICcuL3BpcGVsaW5lLXRyYW5zZm9ybWF0aW9uLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5qZWN0UGlwZWxpbmVJZihjb25kaXRpb25GbiwgLi4udHJhbnNmb3JtYXRpb25zKSB7XG4gIHJldHVybiBwaXBlbGluZVRyYW5zZm9ybWF0aW9uKChvcGVyYXRpb25zLCBjdXJyZW50KSA9PiB7XG4gICAgcmV0dXJuIGNvbmRpdGlvbkZuKGN1cnJlbnQsIG9wZXJhdGlvbnMsIHRyYW5zZm9ybWF0aW9ucylcbiAgICAgID8gWy4uLnRyYW5zZm9ybWF0aW9ucywgLi4ub3BlcmF0aW9uc11cbiAgICAgIDogb3BlcmF0aW9ucztcbiAgfSk7XG59XG4iLCAiaW1wb3J0IHBpcGVsaW5lVHJhbnNmb3JtYXRpb24gZnJvbSAnLi9waXBlbGluZS10cmFuc2Zvcm1hdGlvbi5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluamVjdFBpcGVsaW5lKC4uLnRyYW5zZm9ybWF0aW9ucykge1xuICByZXR1cm4gcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbigob3BlcmF0aW9ucykgPT4ge1xuICAgIHJldHVybiBbLi4udHJhbnNmb3JtYXRpb25zLCAuLi5vcGVyYXRpb25zXTtcbiAgfSk7XG59XG4iLCAiaW1wb3J0IGlzQXJyYXkgZnJvbSAnLi9pcy1hcnJheS5qcyc7XG5pbXBvcnQgaXNTdHJpbmcgZnJvbSAnLi9pcy1zdHJpbmcuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsZW5ndGgoc29tZXRoaW5nV2l0aExlbmd0aE9yU2l6ZSkge1xuICBpZiAoaXNBcnJheShzb21ldGhpbmdXaXRoTGVuZ3RoT3JTaXplKSkge1xuICAgIHJldHVybiBzb21ldGhpbmdXaXRoTGVuZ3RoT3JTaXplLmxlbmd0aDtcbiAgfVxuICBpZiAoaXNTdHJpbmcoc29tZXRoaW5nV2l0aExlbmd0aE9yU2l6ZSkpIHtcbiAgICByZXR1cm4gc29tZXRoaW5nV2l0aExlbmd0aE9yU2l6ZS5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIHNvbWV0aGluZ1dpdGhMZW5ndGhPclNpemUuc2l6ZTtcbn1cbiIsICJpbXBvcnQgc2xpY2UgZnJvbSAnLi9zbGljZS5qcyc7XG5pbXBvcnQgbGVuZ3RoIGZyb20gJy4vbGVuZ3RoLmpzJztcbmltcG9ydCBmaXJzdCBmcm9tICcuL2ZpcnN0LmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJy4vaXMtZW1wdHkuanMnO1xuXG5mdW5jdGlvbiBfaW5zdGFudGlhdGUoKSB7XG4gIGNvbnN0IGFyZ3MgPSBbLi4uYXJndW1lbnRzXTtcbiAgY29uc3QgbGFzdEluZGV4ID0gYXJncy5sZW5ndGggLSAxO1xuICBjb25zdCBpbnN0YW5jZUFyZ3MgPSBzbGljZShhcmdzLCAwLCBsYXN0SW5kZXgpO1xuXG4gIGlmIChpc0VtcHR5KGluc3RhbmNlQXJncykpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSAvLyBubyBhcmd1bWVudHMgdG8gaW5zdGFudGlhdGUgd2l0aFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAobGVuZ3RoKGluc3RhbmNlQXJncykgPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSAvLyBvbmx5IGEga2xhc3MgdG8gaW5zdGFudGlhdGUgd2l0aC4gd2UgZXhwZWN0IGF0IGxlYXN0IG9uZSBhcmd1bWVudCB0byBwYXNzIHRvIHRoZSBrbGFzcyBzbyBleGl0IGhlcmVcblxuICBjb25zdCBmaXJzdEFyZyA9IGZpcnN0KGluc3RhbmNlQXJncyk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChsZW5ndGgoaW5zdGFuY2VBcmdzKSA9PT0gMSAmJiBpc05vbmUoZmlyc3RBcmcpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBLbGFzcyA9IGFyZ3NbbGFzdEluZGV4XTtcbiAgcmV0dXJuIG5ldyBLbGFzcyguLi5pbnN0YW5jZUFyZ3MpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbnN0YW50aWF0ZSgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xuICAgICAgcmV0dXJuIF9pbnN0YW50aWF0ZSguLi5hcmdzLCBhcmd1bWVudHNbMF0pO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIF9pbnN0YW50aWF0ZSguLi5hcmd1bWVudHMpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XG59XG4iLCAiaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXMtb2JqZWN0LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNPYmplY3RFbXB0eShvYmopIHtcbiAgcmV0dXJuIGlzT2JqZWN0KG9iaikgJiYgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNQcm9taXNlKG9iaikge1xuICByZXR1cm4gQm9vbGVhbihvYmopICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9qb2luKGxpc3QsIGNoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmZyb20obGlzdCkuam9pbihjaGFyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gam9pbihsaXN0LCBjaGFyKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9qb2luLCBsaXN0KTtcbiAgfVxuICByZXR1cm4gX2pvaW4obGlzdCwgY2hhcik7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgT2JqZWN0LmtleXM7XG4iLCAiaW1wb3J0IGlzQXJyYXlFbXB0eSBmcm9tICcuL2lzLWFycmF5LWVtcHR5LmpzJztcbmltcG9ydCBpc0Z1bmN0aW9uIGZyb20gJy4vaXMtZnVuY3Rpb24uanMnO1xuaW1wb3J0IGxlbmd0aCBmcm9tICcuL2xlbmd0aC5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IChsaXN0KSA9PiB7XG4gIGlmIChpc0FycmF5RW1wdHkobGlzdCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBsZW4gPSBsZW5ndGgobGlzdCk7XG4gIGNvbnN0IGxhc3RJbmRleCA9IGxlbiAtIDE7XG4gIGlmIChpc0Z1bmN0aW9uKGxpc3QuaXRlbSkpIHtcbiAgICByZXR1cm4gbGlzdC5pdGVtKGxhc3RJbmRleCk7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24obGlzdC5nZXRJdGVtKSkge1xuICAgIHJldHVybiBsaXN0LmdldEl0ZW0obGFzdEluZGV4KTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbihsaXN0Lm9iamVjdEF0KSkge1xuICAgIHJldHVybiBsaXN0Lm9iamVjdEF0KGxhc3RJbmRleCk7XG4gIH1cbiAgaWYgKGlzRnVuY3Rpb24obGlzdC5jaGFyQXQpKSB7XG4gICAgcmV0dXJuIGxpc3QuY2hhckF0KGxhc3RJbmRleCk7XG4gIH1cbiAgcmV0dXJuIGxpc3RbbGFzdEluZGV4XTtcbn07XG4iLCAiaW1wb3J0IHBpcGVsaW5lVHJhbnNmb3JtYXRpb24gZnJvbSAnLi9waXBlbGluZS10cmFuc2Zvcm1hdGlvbi5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHBpcGVsaW5lVHJhbnNmb3JtYXRpb24oKG9wZXJhdGlvbnMsIGN1cnJlbnQpID0+IHtcbiAgY29uc29sZS5sb2coY3VycmVudCk7IC8vZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gIHJldHVybiBvcGVyYXRpb25zO1xufSk7XG4iLCAiY29uc3QgU0hPVUxEX0xPRyA9IHRydWU7XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2coLi4uYXJncykge1xuICBpZiAoIVNIT1VMRF9MT0cpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2coJ1tMT0ddJywgYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dYCwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3YXJuKC4uLmFyZ3MpIHtcbiAgaWYgKCFTSE9VTERfTE9HKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUud2FybignW1dBUk5JTkddJywgYFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dYCwgLi4uYXJncyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcnJvciguLi5hcmdzKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZXJyb3IoJ1tFcnJvcl0nLCBgWyR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfV1gLCAuLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZm8oLi4uYXJncykge1xuICBjb25zb2xlLmluZm8oLi4uYXJncyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaW5mbyxcbiAgbG9nLFxuICB3YXJuLFxuICBlcnJvcixcbn07XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfbHQoYSwgYikge1xuICByZXR1cm4gYSA8IGI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGx0KGEsIGIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX2x0LCBhKTtcbiAgfVxuICByZXR1cm4gX2x0KGEsIGIpO1xufVxuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gX2x0ZShhLCBiKSB7XG4gIHJldHVybiBhIDw9IGI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGx0ZShhLCBiKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9sdGUsIGEpO1xuICB9XG4gIHJldHVybiBfbHRlKGEsIGIpO1xufVxuIiwgImltcG9ydCBtYXAgZnJvbSAnLi9tYXAuanMnO1xuaW1wb3J0IGtleU1hcCBmcm9tICcuL2tleS1tYXAuanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtYXBCeShsaXN0LCBrZXlzKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KG1hcCwga2V5TWFwKGxpc3QpKTtcbiAgfVxuICByZXR1cm4gbWFwKGxpc3QsIGtleU1hcChrZXlzKSk7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfbWF0Y2goc3RyaW5nLCByZWdleCkge1xuICByZXR1cm4gc3RyaW5nLm1hdGNoKHJlZ2V4KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWF0Y2goc3RyaW5nLCByZWdleCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfbWF0Y2gsIHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIF9tYXRjaChzdHJpbmcsIHJlZ2V4KTtcbn1cbiIsICJpbXBvcnQgcmVkdWNlIGZyb20gJy4vcmVkdWNlLmpzJztcbmltcG9ydCBmbGF0dGVuIGZyb20gJy4vZmxhdHRlbi5qcyc7XG5pbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5pbXBvcnQgb3duUHJvcGVydGllcyBmcm9tICcuL293bi1wcm9wZXJ0aWVzLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXMtYXJyYXkuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vaXMtb2JqZWN0LmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcblxuY29uc3QgeyBhc3NpZ24gfSA9IE9iamVjdDtcblxuZnVuY3Rpb24gX21lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xuICByZXR1cm4gcmVkdWNlKFxuICAgIG93blByb3BlcnRpZXMoc291cmNlKSxcbiAgICAoYWNjLCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZVZhbHVlID0gc291cmNlW2tleV07XG4gICAgICBjb25zdCB0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgICAgaWYgKGlzQXJyYXkoc291cmNlVmFsdWUpICYmIGlzQXJyYXkodGFyZ2V0VmFsdWUpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gZmxhdHRlbihzb3VyY2VWYWx1ZSwgdGFyZ2V0VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChzb3VyY2VWYWx1ZSkgJiYgaXNPYmplY3QodGFyZ2V0VmFsdWUpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gX21lcmdlRGVlcChhc3NpZ24oe30sIHRhcmdldFZhbHVlKSwgc291cmNlVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSxcbiAgICB0YXJnZXRcbiAgKTtcbn1cblxuZnVuY3Rpb24gX21lcmdlKHRhcmdldCwgLi4uc291cmNlcykge1xuICByZXR1cm4gcmVkdWNlKFxuICAgIHNvdXJjZXMsXG4gICAgKGFjYywgdikgPT4ge1xuICAgICAgaWYgKGlzTm9uZSh2KSkge1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9tZXJnZURlZXAoYWNjLCB2KTtcbiAgICB9LFxuICAgIHRhcmdldFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZSh0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX21lcmdlLCB0YXJnZXQpO1xuICB9XG4gIHJldHVybiBfbWVyZ2UodGFyZ2V0LCAuLi5zb3VyY2VzKTtcbn1cbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9uZXEoYSwgYikge1xuICByZXR1cm4gYSAhPT0gYjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmVxKGEsIGIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX25lcSwgYSk7XG4gIH1cbiAgcmV0dXJuIF9uZXEoYSwgYik7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG8pIHtcbiAgcmV0dXJuICFvO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IEpTT04ucGFyc2U7XG4iLCAiaW1wb3J0IG1hcEJ5IGZyb20gJy4vbWFwLWJ5LmpzJztcbmV4cG9ydCBkZWZhdWx0IG1hcEJ5O1xuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gX3Byb3h5KHRhcmdldCwgdHJhcHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIHRyYXBzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJveHkodGFyZ2V0LCB0cmFwcykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfcHJveHksIHRhcmdldCk7XG4gIH1cbiAgcmV0dXJuIF9wcm94eSh0YXJnZXQsIHRyYXBzKTtcbn1cbiIsICJmdW5jdGlvbiBfcmFuZ2UobWluLCBtYXgpIHtcbiAgcmV0dXJuIEFycmF5KG1heCAtIG1pbilcbiAgICAuZmlsbChtaW4pXG4gICAgLm1hcCgoZSwgaSkgPT4ge1xuICAgICAgcmV0dXJuIGUgKyBpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5nZShtaW4sIG1heCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gICAgcmV0dXJuIF9yYW5nZSgwLCAxMDApO1xuICB9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgICByZXR1cm4gX3JhbmdlKDAsIG1pbik7XG4gIH1cbiAgcmV0dXJuIF9yYW5nZShtaW4sIG1heCk7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlci5qcyc7XG5pbXBvcnQgcGlwZWxpbmUgZnJvbSAnLi9waXBlbGluZS5qcyc7XG5pbXBvcnQgbm90IGZyb20gJy4vbm90LmpzJztcblxuZnVuY3Rpb24gX3JlamVjdChsaXN0LCBmbikge1xuICByZXR1cm4gZmlsdGVyKGxpc3QsIHBpcGVsaW5lKGZuLCBub3QpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVqZWN0KGxpc3QsIGZuKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9yZWplY3QsIGxpc3QpO1xuICB9XG4gIHJldHVybiBfcmVqZWN0KGxpc3QsIGZuKTtcbn1cbiIsICJpbXBvcnQga2V5TWFwIGZyb20gJy4va2V5LW1hcC5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCByZWplY3QgZnJvbSAnLi9yZWplY3QuanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vZXEuanMnO1xuaW1wb3J0IHBpcGVsaW5lIGZyb20gJy4vcGlwZWxpbmUuanMnO1xuXG5mdW5jdGlvbiBfcmVqZWN0QnkobGlzdCwga2V5LCB0YXJnZXQpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gcmVqZWN0KGxpc3QsICh2YWx1ZSkgPT4ge1xuICAgICAgcmV0dXJuIGtleSBpbiB2YWx1ZTtcbiAgICB9KTtcbiAgfVxuICBjb25zdCBrbSA9IGtleU1hcChrZXkpO1xuICBjb25zdCBjaGVja2VyID0gcGlwZWxpbmUoa20sIGlzRnVuY3Rpb24odGFyZ2V0KSA/IHRhcmdldCA6IGVxKHRhcmdldCkpO1xuICByZXR1cm4gcmVqZWN0KGxpc3QsIGNoZWNrZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWplY3RCeShsaXN0LCBrZXksIHZhbHVlKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9yZWplY3RCeSwgbGlzdCk7XG4gIH1cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gY3VycnkoX3JlamVjdEJ5LCBsaXN0LCBrZXkpO1xuICB9XG4gIHJldHVybiBfcmVqZWN0QnkobGlzdCwga2V5LCB2YWx1ZSk7XG59XG4iLCAiaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5mdW5jdGlvbiBfcmVwbGFjZShzdHJpbmcsIHJlZ2V4LCByZXBsYWNlV2l0aCkge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UocmVnZXgsIHJlcGxhY2VXaXRoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVwbGFjZShzdHJpbmcsIHJlZ2V4LCByZXBsYWNlV2l0aCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBjdXJyeShfcmVwbGFjZSwgc3RyaW5nLCByZWdleCk7XG4gIH1cbiAgcmV0dXJuIF9yZXBsYWNlKHN0cmluZywgcmVnZXgsIHJlcGxhY2VXaXRoKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gIHJldHVybiBudWxsO1xufTtcbiIsICJpbXBvcnQgaWQgZnJvbSAnLi9pZC5qcyc7XG5leHBvcnQgZGVmYXVsdCBpZDtcbiIsICJpbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuY29uc3QgQVNDRU5ESU5HID0gKGEsIGIpID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID09PSBiID8gMCA6IDE7XG59O1xuY29uc3QgREVTQ0VORElORyA9IChhLCBiKSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIHJldHVybiBhIDwgYiA/IDEgOiBhID09PSBiID8gMCA6IC0xO1xufTtcbmNvbnN0IFJBTkRPTSA9ICgpID0+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPj0gMC41ID8gLTEgOiAxO1xufTtcblxuZnVuY3Rpb24gX3NvcnQobGlzdCwgZm4pIHtcbiAgcmV0dXJuIGxpc3Quc29ydChmbik7XG59XG5cbmNvbnN0IHNvcnQgPSAobGlzdCwgZm4gPSBERVNDRU5ESU5HKSA9PiB7XG4gIGlmICghaXNOb25lKGxpc3QpICYmIGlzRnVuY3Rpb24obGlzdCkpIHtcbiAgICByZXR1cm4gY3VycnkoX3NvcnQsIGxpc3QpO1xuICB9XG4gIHJldHVybiBfc29ydChsaXN0LCBmbik7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb3J0O1xuZXhwb3J0IHsgUkFORE9NIGFzIFJBTkRPTSB9O1xuZXhwb3J0IHsgQVNDRU5ESU5HIGFzIEFTQ0VORElORyB9O1xuZXhwb3J0IHsgREVTQ0VORElORyBhcyBERVNDRU5ESU5HIH07XG4iLCAiaW1wb3J0IGlzRW1wdHkgZnJvbSAnLi9pcy1lbXB0eS5qcyc7XG5pbXBvcnQgbGVuZ3RoIGZyb20gJy4vbGVuZ3RoLmpzJztcbmltcG9ydCBzb3J0IGZyb20gJy4vc29ydC5qcyc7XG5pbXBvcnQgc2xpY2UgZnJvbSAnLi9zbGljZS5qcyc7XG5pbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF9zYW1wbGVNYW55KGFyciwgYW1vdW50KSB7XG4gIGlmIChpc0VtcHR5KGFycikpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgY29uc3QgbGVuID0gbGVuZ3RoKGFycik7XG4gIGlmIChhbW91bnQgPj0gbGVuKSB7XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIHJldHVybiBzbGljZShzb3J0KGFyciwgc29ydC5SQU5ET00pLCAwLCBhbW91bnQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYW1wbGVNYW55KGFyciwgYW1vdW50KSB7XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGN1cnJ5KF9zYW1wbGVNYW55LCBhcnIpO1xuICB9XG4gIHJldHVybiBfc2FtcGxlTWFueShhcnIsIGFtb3VudCk7XG59XG4iLCAiaW1wb3J0IGlzRW1wdHkgZnJvbSAnLi9pcy1lbXB0eS5qcyc7XG5pbXBvcnQgbGVuZ3RoIGZyb20gJy4vbGVuZ3RoLmpzJztcblxuY29uc3QgeyBmbG9vciwgcmFuZG9tIH0gPSBNYXRoO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYW1wbGUoYXJyKSB7XG4gIGlmIChpc0VtcHR5KGFycikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gQXJyYXkuZnJvbShhcnIpW2Zsb29yKHJhbmRvbSgpICogbGVuZ3RoKGFycikpXTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzbGVlcChkdXJhdGlvbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlc29sdmUoKTtcbiAgICB9LCBkdXJhdGlvbik7XG4gIH0pO1xufVxuIiwgImltcG9ydCBrZXlNYXAgZnJvbSAnLi9rZXktbWFwLmpzJztcbmltcG9ydCBzb3J0IGZyb20gJy4vc29ydC5qcyc7XG5pbXBvcnQgeyBBU0NFTkRJTkcsIERFU0NFTkRJTkcsIFJBTkRPTSB9IGZyb20gJy4vc29ydC5qcyc7XG5pbXBvcnQgcGlwZSBmcm9tICcuL3BpcGUuanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBzb3J0Qnk7XG5leHBvcnQgeyBSQU5ET00gYXMgUkFORE9NIH07XG5leHBvcnQgeyBBU0NFTkRJTkcgYXMgQVNDRU5ESU5HIH07XG5leHBvcnQgeyBERVNDRU5ESU5HIGFzIERFU0NFTkRJTkcgfTtcblxuZnVuY3Rpb24gX3NvcnRCeShsaXN0LCBrZXksIGRpcmVjdGlvbkZuID0gREVTQ0VORElORykge1xuICBjb25zdCBtYXBwZXIgPSBrZXlNYXAoa2V5KTtcbiAgcmV0dXJuIHBpcGUoXG4gICAgbGlzdCxcbiAgICBzb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gZGlyZWN0aW9uRm4obWFwcGVyKGEpLCBtYXBwZXIoYikpO1xuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNvcnRCeShsaXN0LCBrZXksIGRpcmVjdGlvbkZuID0gREVTQ0VORElORykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfc29ydEJ5LCBsaXN0KTtcbiAgfVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBjdXJyeShfc29ydEJ5LCBsaXN0LCBrZXkpO1xuICB9XG4gIHJldHVybiBfc29ydEJ5KGxpc3QsIGtleSwgZGlyZWN0aW9uRm4pO1xufVxuIiwgImltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gX3NwbGl0KHN0cmluZywgY2hhck9yUmVnZXgpIHtcbiAgcmV0dXJuIHN0cmluZy5zcGxpdChjaGFyT3JSZWdleCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwbGl0KHN0cmluZywgY2hhck9yUmVnZXgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX3NwbGl0LCBzdHJpbmcpO1xuICB9XG4gIHJldHVybiBfc3BsaXQoc3RyaW5nLCBjaGFyT3JSZWdleCk7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgSlNPTi5zdHJpbmdpZnk7XG4iLCAiLyogZXNsaW50LWRpc2FibGUgbWF4LWNsYXNzZXMtcGVyLWZpbGUgKi9cbmltcG9ydCBpc1Byb21pc2UgZnJvbSAnLi9pcy1wcm9taXNlLmpzJztcbmltcG9ydCBhbnkgZnJvbSAnLi9hbnkuanMnO1xuaW1wb3J0IHBpcGUgZnJvbSAnLi9waXBlLmpzJztcbmltcG9ydCBwaXBlbGluZSBmcm9tICcuL3BpcGVsaW5lLmpzJztcbmltcG9ydCBtYXAgZnJvbSAnLi9tYXAuanMnO1xuaW1wb3J0IGZpbHRlciBmcm9tICcuL2ZpbHRlci5qcyc7XG5pbXBvcnQgbm90IGZyb20gJy4vbm90LmpzJztcbmltcG9ydCBlcSBmcm9tICcuL2VxLmpzJztcbmltcG9ydCBpc05vbmUgZnJvbSAnLi9pcy1ub25lLmpzJztcbmltcG9ydCBmaXJzdCBmcm9tICcuL2ZpcnN0LmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcbmltcG9ydCBjb25kaXRpb25hbCBmcm9tICcuL2NvbmRpdGlvbmFsLmpzJztcbmltcG9ydCBib3RoIGZyb20gJy4vYm90aC5qcyc7XG5cbmNvbnN0IE5PT1AgPSAoKSA9PiB7XG4gIC8qKi9cbn07XG5cbmZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICBzZXRUaW1lb3V0KGZuLCAwKTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lR2V0dGVyRnVuY3Rpb24ocHJvcCkge1xuICByZXR1cm4gKG9iaikgPT4ge1xuICAgIHJldHVybiBvYmpbcHJvcF07XG4gIH07XG59XG5mdW5jdGlvbiBkZWZpbmVTZXR0ZXJGdW5jdGlvbihwcm9wKSB7XG4gIHJldHVybiAob2JqLCB2KSA9PiB7XG4gICAgb2JqW3Byb3BdID0gdjtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xufVxuXG5mdW5jdGlvbiogaWRHZW4oKSB7XG4gIGxldCBpZCA9IDA7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgeWllbGQgKytpZDtcbiAgfVxufVxuXG5jb25zdCB0YXNrSWRHZW4gPSBpZEdlbigpO1xuY29uc3Qgb3BlcmF0aW9uSWRHZW4gPSBpZEdlbigpO1xuXG5jb25zdCBTWU1fTW9kZSA9ICdtb2RlJztcbmNvbnN0IFNZTV9UYXNrID0gJ3Rhc2snO1xuY29uc3QgU1lNX0lzUnVubmluZyA9ICdpc1J1bm5pbmcnO1xuY29uc3QgU1lNX0lzQ2FuY2VsbGVkID0gJ2lzQ2FuY2VsbGVkJztcbmNvbnN0IFNZTV9JZCA9ICdpZCc7XG5jb25zdCBTWU1fQ29udGV4dCA9ICdjb250ZXh0JztcbmNvbnN0IFNZTV9Qcm9taXNlID0gJ3Byb21pc2UnO1xuY29uc3QgU1lNX0dlbmVyYXRvciA9ICdnZW5lcmF0b3InO1xuY29uc3QgU1lNX09wZXJhdGlvbnMgPSAnb3BlcmF0aW9ucyc7XG5jb25zdCBTWU1fSXRlcmF0b3IgPSAnaXRlcmF0b3InO1xuXG5jb25zdCBnZXRNb2RlID0gZGVmaW5lR2V0dGVyRnVuY3Rpb24oU1lNX01vZGUpO1xuY29uc3Qgc2V0TW9kZSA9IGRlZmluZVNldHRlckZ1bmN0aW9uKFNZTV9Nb2RlKTtcbmNvbnN0IGdldFRhc2sgPSBkZWZpbmVHZXR0ZXJGdW5jdGlvbihTWU1fVGFzayk7XG5jb25zdCBzZXRUYXNrID0gZGVmaW5lU2V0dGVyRnVuY3Rpb24oU1lNX1Rhc2spO1xuY29uc3QgZ2V0SXNSdW5uaW5nID0gZGVmaW5lR2V0dGVyRnVuY3Rpb24oU1lNX0lzUnVubmluZyk7XG5jb25zdCBzZXRJc1J1bm5pbmcgPSBkZWZpbmVTZXR0ZXJGdW5jdGlvbihTWU1fSXNSdW5uaW5nKTtcbmNvbnN0IGdldElzQ2FuY2VsbGVkID0gZGVmaW5lR2V0dGVyRnVuY3Rpb24oU1lNX0lzQ2FuY2VsbGVkKTtcbmNvbnN0IHNldElzQ2FuY2VsbGVkID0gZGVmaW5lU2V0dGVyRnVuY3Rpb24oU1lNX0lzQ2FuY2VsbGVkKTtcbmNvbnN0IGdldElkID0gZGVmaW5lR2V0dGVyRnVuY3Rpb24oU1lNX0lkKTtcbmNvbnN0IHNldElkID0gZGVmaW5lU2V0dGVyRnVuY3Rpb24oU1lNX0lkKTtcbmNvbnN0IGdldENvbnRleHQgPSBkZWZpbmVHZXR0ZXJGdW5jdGlvbihTWU1fQ29udGV4dCk7XG5jb25zdCBzZXRDb250ZXh0ID0gZGVmaW5lU2V0dGVyRnVuY3Rpb24oU1lNX0NvbnRleHQpO1xuY29uc3QgZ2V0UHJvbWlzZSA9IGRlZmluZUdldHRlckZ1bmN0aW9uKFNZTV9Qcm9taXNlKTtcbmNvbnN0IHNldFByb21pc2UgPSBkZWZpbmVTZXR0ZXJGdW5jdGlvbihTWU1fUHJvbWlzZSk7XG5jb25zdCBnZXRHZW5lcmF0b3IgPSBkZWZpbmVHZXR0ZXJGdW5jdGlvbihTWU1fR2VuZXJhdG9yKTtcbmNvbnN0IHNldEdlbmVyYXRvciA9IGRlZmluZVNldHRlckZ1bmN0aW9uKFNZTV9HZW5lcmF0b3IpO1xuY29uc3QgZ2V0T3BlcmF0aW9ucyA9IGRlZmluZUdldHRlckZ1bmN0aW9uKFNZTV9PcGVyYXRpb25zKTtcbmNvbnN0IHNldE9wZXJhdGlvbnMgPSBkZWZpbmVTZXR0ZXJGdW5jdGlvbihTWU1fT3BlcmF0aW9ucyk7XG5jb25zdCBnZXRJdGVyYXRvciA9IGRlZmluZUdldHRlckZ1bmN0aW9uKFNZTV9JdGVyYXRvcik7XG5jb25zdCBzZXRJdGVyYXRvciA9IGRlZmluZVNldHRlckZ1bmN0aW9uKFNZTV9JdGVyYXRvcik7XG5cbmNvbnN0IGlzTm90Q2FuY2VsbGVkID0gcGlwZWxpbmUoaXNDYW5jZWxsZWQsIG5vdCk7XG5jb25zdCBpc1J1bm5pbmdBbmROb3RDYW5jZWxsZWQgPSBwaXBlbGluZShib3RoKGlzUnVubmluZywgaXNOb3RDYW5jZWxsZWQpKTtcbmNvbnN0IGdldFJ1bm5pbmdPcGVyYXRpb25zID0gcGlwZWxpbmUoZ2V0T3BlcmF0aW9ucywgZmlsdGVyKGlzUnVubmluZykpO1xuY29uc3QgZ2V0Q3VycmVudE9wZXJhdGlvbiA9IHBpcGVsaW5lKGdldFJ1bm5pbmdPcGVyYXRpb25zLCBmaXJzdCk7XG5jb25zdCBpc1Rhc2tSdW5uaW5nID0gcGlwZWxpbmUoXG4gIGdldFJ1bm5pbmdPcGVyYXRpb25zLFxuICBtYXAoaXNSdW5uaW5nQW5kTm90Q2FuY2VsbGVkKSxcbiAgYW55XG4pO1xuY29uc3QgaXNUYXNrTm90UnVubmluZyA9IHBpcGVsaW5lKGlzVGFza1J1bm5pbmcsIG5vdCk7XG5jb25zdCBpc09wZXJhdGlvblJ1bm5pbmcgPSBwaXBlbGluZShnZXRJc1J1bm5pbmcsIGVxKHRydWUpKTtcbmNvbnN0IGlzVGFza0NhbmNlbGxlZCA9IHBpcGVsaW5lKGdldElzQ2FuY2VsbGVkLCBlcSh0cnVlKSk7XG5jb25zdCBpc09wZXJhdGlvbkNhbmNlbGxlZCA9IHBpcGVsaW5lKGdldElzQ2FuY2VsbGVkLCBlcSh0cnVlKSk7XG5jb25zdCBjYW5jZWxPcGVyYXRpb24gPSBwaXBlbGluZShjdXJyeShzZXRJc0NhbmNlbGxlZCwgdHJ1ZSksIGdldFByb21pc2UpO1xuY29uc3QgY2FuY2VsT3BlcmF0aW9ucyA9IHBpcGVsaW5lKGdldE9wZXJhdGlvbnMsIG1hcChjYW5jZWxPcGVyYXRpb24pKTtcblxuY29uc3QgaXNOb3RSdW5uaW5nID0gcGlwZWxpbmUoaXNSdW5uaW5nLCBub3QpO1xuY29uc3QgZ2V0TmV4dE9wZXJhdGlvbnMgPSBwaXBlbGluZShcbiAgZ2V0T3BlcmF0aW9ucyxcbiAgZmlsdGVyKGlzTm90UnVubmluZyksXG4gIGZpbHRlcihpc05vdENhbmNlbGxlZClcbik7XG5cbmNvbnN0IGdldE5leHRPcGVyYXRpb24gPSBwaXBlbGluZShnZXROZXh0T3BlcmF0aW9ucywgZmlyc3QpO1xuY29uc3QgaGFzTmV4dE9wZXJhdGlvbiA9IHBpcGVsaW5lKGdldE5leHRPcGVyYXRpb24sIGlzTm9uZSwgbm90KTtcbmNvbnN0IHJ1bk5leHRPcGVyYXRpb24gPSBwaXBlbGluZShcbiAgZ2V0TmV4dE9wZXJhdGlvbixcbiAgY29uZGl0aW9uYWwoaXNOb25lLCBOT09QLCBwZXJmb3JtKVxuKTtcblxuY29uc3QgZ2V0VGFza0FuZFJ1bk5leHRPcGVyYXRpb24gPSBwaXBlbGluZShcbiAgZ2V0VGFzayxcbiAgY3Vycnkoc2V0SXNSdW5uaW5nLCBmYWxzZSksXG4gIHJ1bk5leHRPcGVyYXRpb25cbik7XG5jb25zdCBjbGVhbkFmdGVyUnVuID0gcGlwZWxpbmUoXG4gIGN1cnJ5KHNldElzUnVubmluZywgZmFsc2UpLFxuICBnZXRUYXNrQW5kUnVuTmV4dE9wZXJhdGlvblxuKTtcblxuY29uc3QgcGVyZm9ybU9wZXJhdGlvbiA9IHBpcGVsaW5lKGN1cnJ5KHNldElzUnVubmluZywgdHJ1ZSksIChvcGVyYXRpb24pID0+IHtcbiAgcmV0dXJuIHN0ZXBPcGVyYXRpb24ob3BlcmF0aW9uKS50aGVuKCh2YWx1ZSkgPT4ge1xuICAgIGNsZWFuQWZ0ZXJSdW4ob3BlcmF0aW9uKTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0pO1xufSk7XG5cbmNsYXNzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih7IGdlbmVyYXRvciwgY29udGV4dCwgbW9kZSwgaWRQcm92aWRlciB9KSB7XG4gICAgc2V0SWQodGhpcywgKGlkUHJvdmlkZXIgfHwgdGFza0lkR2VuKS5uZXh0KCkudmFsdWUpO1xuICAgIHNldEdlbmVyYXRvcih0aGlzLCBnZW5lcmF0b3IpO1xuICAgIHNldENvbnRleHQodGhpcywgY29udGV4dCk7XG4gICAgc2V0T3BlcmF0aW9ucyh0aGlzLCBbXSk7XG4gICAgc2V0TW9kZSh0aGlzLCBtb2RlIHx8ICdkcm9wJyk7XG4gICAgc2V0SXNSdW5uaW5nKHRoaXMsIGZhbHNlKTtcbiAgfVxuXG4gIGNhbmNlbCgpIHtcbiAgICByZXR1cm4gY2FuY2VsKHRoaXMpO1xuICB9XG4gIHJ1biguLi5zdGF0ZSkge1xuICAgIHJldHVybiBwZXJmb3JtKHRoaXMsIC4uLnN0YXRlKTtcbiAgfVxuICBwZXJmb3JtKC4uLnN0YXRlKSB7XG4gICAgcmV0dXJuIHBlcmZvcm0odGhpcywgLi4uc3RhdGUpO1xuICB9XG5cbiAgcnVuTmV4dE9wZXJhdGlvbigpIHtcbiAgICByZXR1cm4gcnVuTmV4dE9wZXJhdGlvbih0aGlzKTtcbiAgfVxuICBjcmVhdGVPcGVyYXRpb24oLi4uc3RhdGUpIHtcbiAgICByZXR1cm4gY3JlYXRlT3BlcmF0aW9uKHRoaXMsIC4uLnN0YXRlKTtcbiAgfVxuICBlbnF1ZXVlTmV3T3BlcmF0aW9uKC4uLnN0YXRlKSB7XG4gICAgcmV0dXJuIGVucXVldWVOZXdPcGVyYXRpb24odGhpcywgLi4uc3RhdGUpO1xuICB9XG4gIGVucXVldWVOZXh0T3BlcmF0aW9uKC4uLnN0YXRlKSB7XG4gICAgcmV0dXJuIGVucXVldWVOZXh0T3BlcmF0aW9uKHRoaXMsIC4uLnN0YXRlKTtcbiAgfVxuICBwdXNoT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBwdXNoT3BlcmF0aW9uKHRoaXMsIG9wZXJhdGlvbik7XG4gIH1cbiAgcmVtb3ZlT3BlcmF0aW9uKG9wZXJhdGlvbikge1xuICAgIHJldHVybiByZW1vdmVPcGVyYXRpb24odGhpcywgb3BlcmF0aW9uKTtcbiAgfVxuXG4gIHN0YXRpYyBpZCh0YXNrKSB7XG4gICAgcmV0dXJuIGdldElkKHRhc2spO1xuICB9XG4gIHN0YXRpYyBnZXRJZCh0YXNrKSB7XG4gICAgcmV0dXJuIGdldElkKHRhc2spO1xuICB9XG4gIHN0YXRpYyBpc1J1bm5pbmcodGFzaykge1xuICAgIHJldHVybiBpc1J1bm5pbmcodGFzayk7XG4gIH1cbiAgc3RhdGljIGhhc05leHRPcGVyYXRpb24odGFzaykge1xuICAgIHJldHVybiBoYXNOZXh0T3BlcmF0aW9uKHRhc2spO1xuICB9XG4gIHN0YXRpYyBnZXRDdXJyZW50T3BlcmF0aW9uKHRhc2spIHtcbiAgICByZXR1cm4gZ2V0Q3VycmVudE9wZXJhdGlvbih0YXNrKTtcbiAgfVxuICBzdGF0aWMgZ2V0UnVubmluZ09wZXJhdGlvbnModGFzaykge1xuICAgIHJldHVybiBnZXRSdW5uaW5nT3BlcmF0aW9ucyh0YXNrKTtcbiAgfVxuXG4gIHN0YXRpYyBjYW5jZWwodGFzaykge1xuICAgIHJldHVybiBjYW5jZWwodGFzayk7XG4gIH1cbiAgc3RhdGljIHJ1bih0YXNrLCAuLi5zdGF0ZSkge1xuICAgIHJldHVybiBwZXJmb3JtKHRhc2ssIC4uLnN0YXRlKTtcbiAgfVxuICBzdGF0aWMgcGVyZm9ybSh0YXNrLCAuLi5zdGF0ZSkge1xuICAgIHJldHVybiBwZXJmb3JtKHRhc2ssIC4uLnN0YXRlKTtcbiAgfVxuXG4gIHN0YXRpYyBydW5OZXh0T3BlcmF0aW9uKHRhc2spIHtcbiAgICByZXR1cm4gcnVuTmV4dE9wZXJhdGlvbih0YXNrKTtcbiAgfVxuICBzdGF0aWMgY3JlYXRlT3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU9wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSk7XG4gIH1cbiAgc3RhdGljIGVucXVldWVOZXdPcGVyYXRpb24odGFzaywgLi4uc3RhdGUpIHtcbiAgICByZXR1cm4gZW5xdWV1ZU5ld09wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSk7XG4gIH1cbiAgc3RhdGljIGVucXVldWVOZXh0T3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKSB7XG4gICAgcmV0dXJuIGVucXVldWVOZXh0T3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKTtcbiAgfVxuICBzdGF0aWMgcHVzaE9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gcHVzaE9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pO1xuICB9XG4gIHN0YXRpYyByZW1vdmVPcGVyYXRpb24odGFzaywgb3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIHJlbW92ZU9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pO1xuICB9XG59XG5cbmNsYXNzIE9wZXJhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHsgdGFzaywgc3RhdGUsIGlkUHJvdmlkZXIgfSkge1xuICAgIGNvbnN0IGdlbmVyYXRvciA9IGdldEdlbmVyYXRvcih0YXNrKTtcbiAgICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCh0YXNrKTtcbiAgICBzZXRJc1J1bm5pbmcodGhpcywgZmFsc2UpO1xuICAgIHNldElzQ2FuY2VsbGVkKHRoaXMsIGZhbHNlKTtcbiAgICBzZXRDb250ZXh0KHRoaXMsIGNvbnRleHQpO1xuICAgIHNldFRhc2sodGhpcywgdGFzayk7XG4gICAgc2V0SWQodGhpcywgKGlkUHJvdmlkZXIgfHwgb3BlcmF0aW9uSWRHZW4pLm5leHQoKS52YWx1ZSk7XG4gICAgc2V0SXRlcmF0b3IodGhpcywgZ2VuZXJhdG9yLmNhbGwoY29udGV4dCwgLi4uc3RhdGUpKTtcbiAgICBzZXRQcm9taXNlKHRoaXMsIFByb21pc2UucmVzb2x2ZSk7XG4gIH1cblxuICBydW4oKSB7XG4gICAgcmV0dXJuIHBlcmZvcm0odGhpcyk7XG4gIH1cbiAgY2FuY2VsKCkge1xuICAgIHJldHVybiBjYW5jZWwodGhpcyk7XG4gIH1cbiAgcGVyZm9ybSgpIHtcbiAgICByZXR1cm4gcGVyZm9ybSh0aGlzKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRJZChvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gZ2V0SWQob3BlcmF0aW9uKTtcbiAgfVxuICBzdGF0aWMgZ2V0VGFzayhvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gZ2V0VGFzayhvcGVyYXRpb24pO1xuICB9XG4gIHN0YXRpYyBpc1J1bm5pbmcob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIGlzUnVubmluZyhvcGVyYXRpb24pO1xuICB9XG4gIHN0YXRpYyBpc0NhbmNlbGxlZChvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gaXNDYW5jZWxsZWQob3BlcmF0aW9uKTtcbiAgfVxuICBzdGF0aWMgZ2V0UHJvbWlzZShvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gZ2V0UHJvbWlzZShvcGVyYXRpb24pO1xuICB9XG5cbiAgc3RhdGljIHJ1bihvcGVyYXRpb24pIHtcbiAgICByZXR1cm4gcGVyZm9ybShvcGVyYXRpb24pO1xuICB9XG4gIHN0YXRpYyBjYW5jZWwob3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIGNhbmNlbChvcGVyYXRpb24pO1xuICB9XG4gIHN0YXRpYyBwZXJmb3JtKG9wZXJhdGlvbikge1xuICAgIHJldHVybiBwZXJmb3JtKG9wZXJhdGlvbik7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FuY2VsKHRhc2tPck9wZXJhdGlvbikge1xuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgVGFzaykge1xuICAgIHJldHVybiBjYW5jZWxUYXNrKHRhc2tPck9wZXJhdGlvbik7XG4gIH1cbiAgaWYgKHRhc2tPck9wZXJhdGlvbiBpbnN0YW5jZW9mIE9wZXJhdGlvbikge1xuICAgIHJldHVybiBjYW5jZWxPcGVyYXRpb24odGFza09yT3BlcmF0aW9uKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHBlcmZvcm0odGFza09yT3BlcmF0aW9uLCAuLi5zdGF0ZSkge1xuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgVGFzaykge1xuICAgIHJldHVybiBwZXJmb3JtVGFzayh0YXNrT3JPcGVyYXRpb24sIC4uLnN0YXRlKTtcbiAgfVxuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgT3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIHBlcmZvcm1PcGVyYXRpb24odGFza09yT3BlcmF0aW9uLCAuLi5zdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBwZXJmb3JtVGFzayh0YXNrLCAuLi5zdGF0ZSkge1xuICBzd2l0Y2ggKGdldE1vZGUodGFzaykpIHtcbiAgICBjYXNlICdkcm9wJzpcbiAgICAgIHJldHVybiBwZXJmb3JtVGFza0luTW9kZURyb3AodGFzaywgLi4uc3RhdGUpO1xuICAgIGNhc2UgJ3Jlc3RhcnQnOlxuICAgICAgcmV0dXJuIHBlcmZvcm1UYXNrSW5Nb2RlUmVzdGFydCh0YXNrLCAuLi5zdGF0ZSk7XG4gICAgY2FzZSAna2VlcExhdGVzdCc6XG4gICAgICByZXR1cm4gcGVyZm9ybVRhc2tJbk1vZGVLZWVwTGF0ZXN0KHRhc2ssIC4uLnN0YXRlKTtcbiAgICBjYXNlICdlbnF1ZXVlJzpcbiAgICAgIHJldHVybiBwZXJmb3JtVGFza0luTW9kZUVucXVldWUodGFzaywgLi4uc3RhdGUpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gcGVyZm9ybVRhc2tEZWZhdWx0KHRhc2ssIC4uLnN0YXRlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwZXJmb3JtVGFza0luTW9kZVJlc3RhcnQodGFzaywgLi4uc3RhdGUpIHtcbiAgaWYgKGlzVGFza05vdFJ1bm5pbmcodGFzaykpIHtcbiAgICByZXR1cm4gZW5xdWV1ZU5ld09wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSk7XG4gIH1cbiAgY2FuY2VsT3BlcmF0aW9ucyh0YXNrKTtcbiAgcmV0dXJuIGVucXVldWVOZXdPcGVyYXRpb24odGFzaywgLi4uc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBwZXJmb3JtVGFza0luTW9kZURyb3AodGFzaywgLi4uc3RhdGUpIHtcbiAgaWYgKGlzVGFza05vdFJ1bm5pbmcodGFzaykpIHtcbiAgICByZXR1cm4gZW5xdWV1ZU5ld09wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHBpcGUodGFzaywgZ2V0Q3VycmVudE9wZXJhdGlvbiwgZ2V0UHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHBlcmZvcm1UYXNrSW5Nb2RlS2VlcExhdGVzdCh0YXNrLCAuLi5zdGF0ZSkge1xuICBpZiAoaXNUYXNrTm90UnVubmluZyh0YXNrKSkge1xuICAgIHJldHVybiBlbnF1ZXVlTmV3T3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKTtcbiAgfVxuICBpZiAocGlwZSh0YXNrLCBoYXNOZXh0T3BlcmF0aW9uLCBub3QpKSB7XG4gICAgZW5xdWV1ZU5leHRPcGVyYXRpb24odGFzaywgLi4uc3RhdGUpO1xuICB9XG4gIHJldHVybiBwaXBlKHRhc2ssIGdldEN1cnJlbnRPcGVyYXRpb24sIGdldFByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBwZXJmb3JtVGFza0luTW9kZUVucXVldWUodGFzaywgLi4uc3RhdGUpIHtcbiAgaWYgKGlzVGFza05vdFJ1bm5pbmcodGFzaykpIHtcbiAgICByZXR1cm4gZW5xdWV1ZU5ld09wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSk7XG4gIH1cbiAgZW5xdWV1ZU5leHRPcGVyYXRpb24odGFzaywgLi4uc3RhdGUpO1xuICByZXR1cm4gcGlwZSh0YXNrLCBnZXRDdXJyZW50T3BlcmF0aW9uLCBnZXRQcm9taXNlKTtcbn1cblxuZnVuY3Rpb24gcGVyZm9ybVRhc2tEZWZhdWx0KHRhc2spIHtcbiAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGVyZm9ybSB0YXNrIGluIG1vZGU6ICR7Z2V0TW9kZSh0YXNrKX1gKTtcbn1cblxuZnVuY3Rpb24gZW5xdWV1ZU5ld09wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSkge1xuICBzZXRJc1J1bm5pbmcodGFzaywgdHJ1ZSk7XG4gIHJldHVybiBwaXBlKGVucXVldWVOZXh0T3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKSwgcGVyZm9ybSk7XG59XG5cbmZ1bmN0aW9uIGVucXVldWVOZXh0T3BlcmF0aW9uKHRhc2ssIC4uLnN0YXRlKSB7XG4gIHJldHVybiBwaXBlKGNyZWF0ZU9wZXJhdGlvbih0YXNrLCAuLi5zdGF0ZSksIChvcGVyYXRpb24pID0+IHtcbiAgICByZXR1cm4gcHVzaE9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcHVzaE9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pIHtcbiAgc2V0T3BlcmF0aW9ucyh0YXNrLCBbLi4uZ2V0T3BlcmF0aW9ucyh0YXNrKSwgb3BlcmF0aW9uXSk7XG4gIHJldHVybiBvcGVyYXRpb247XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU9wZXJhdGlvbih0YXNrLCBvcGVyYXRpb24pIHtcbiAgY29uc3Qgb3BlcmF0aW9uSWQgPSBwaXBlKG9wZXJhdGlvbiwgZ2V0SWQpO1xuICBjb25zdCBvcGVyYXRpb25zID0gcGlwZSh0YXNrLCBnZXRPcGVyYXRpb25zKTtcbiAgY29uc3QgbmV3T3BlcmF0aW9ucyA9IHBpcGUoXG4gICAgb3BlcmF0aW9ucyxcbiAgICBmaWx0ZXIoKG9wKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0SWQob3ApICE9PSBvcGVyYXRpb25JZDtcbiAgICB9KVxuICApO1xuICBzZXRPcGVyYXRpb25zKHRhc2ssIG5ld09wZXJhdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBzdGVwT3BlcmF0aW9uKG9wZXJhdGlvbiwgY3VycmVudCkge1xuICBjb25zdCB0YXNrID0gZ2V0VGFzayhvcGVyYXRpb24pO1xuICBjb25zdCBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKG9wZXJhdGlvbik7XG5cbiAgaWYgKGlzQ2FuY2VsbGVkKG9wZXJhdGlvbikpIHtcbiAgICByZXR1cm4gc3RlcE9wZXJhdGlvbklmQ2FuY2VsbGVkKHRhc2ssIG9wZXJhdGlvbiwgY3VycmVudCk7XG4gIH1cblxuICAvLyBgaXRlcmF0b3IubmV4dGAgY2FsbHMgdGhlIG5leHQgaXRlcmF0aW9uIG9mIGNvZGUgaW4gdGhlIHBhc3NlZCBpbiBnZW5lcmF0b3JcbiAgY29uc3QgaXRlbSA9IGl0ZXJhdG9yLm5leHQoY3VycmVudCk7XG4gIGNvbnN0IHsgZG9uZSwgdmFsdWUgfSA9IGl0ZW07XG5cbiAgaWYgKGRvbmUpIHtcbiAgICByZXR1cm4gc3RlcE9wZXJhdGlvbklmRG9uZSh0YXNrLCBvcGVyYXRpb24sIHZhbHVlKTtcbiAgfVxuXG4gIHJldHVybiBzdGVwT3BlcmF0aW9uV2l0aFByb21pc2UoXG4gICAgdGFzayxcbiAgICBvcGVyYXRpb24sXG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgc2V0SW1tZWRpYXRlKGFzeW5jICgpID0+IHtcbiAgICAgICAgY29uc3QgbmV4dFZhbHVlID0gaXNQcm9taXNlKHZhbHVlKSA/IGF3YWl0IHZhbHVlIDogdmFsdWU7XG4gICAgICAgIHN0ZXBPcGVyYXRpb24ob3BlcmF0aW9uLCBuZXh0VmFsdWUpLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHN0ZXBPcGVyYXRpb25XaXRoUHJvbWlzZSh0YXNrLCBvcGVyYXRpb24sIHByb21pc2UpIHtcbiAgcmV0dXJuIHBpcGUob3BlcmF0aW9uLCBjdXJyeShzZXRQcm9taXNlLCBwcm9taXNlKSwgZ2V0UHJvbWlzZSk7XG59XG5cbmZ1bmN0aW9uIHN0ZXBPcGVyYXRpb25GaW5hbFN0ZXAodGFzaywgb3BlcmF0aW9uLCB2YWx1ZSkge1xuICByZW1vdmVPcGVyYXRpb24odGFzaywgb3BlcmF0aW9uKTtcblxuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICByZXNvbHZlKHZhbHVlKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHN0ZXBPcGVyYXRpb25XaXRoUHJvbWlzZSh0YXNrLCBvcGVyYXRpb24sIHByb21pc2UpO1xufVxuXG5mdW5jdGlvbiBzdGVwT3BlcmF0aW9uSWZDYW5jZWxsZWQodGFzaywgb3BlcmF0aW9uLCBjdXJyZW50KSB7XG4gIHJldHVybiBzdGVwT3BlcmF0aW9uRmluYWxTdGVwKHRhc2ssIG9wZXJhdGlvbiwgY3VycmVudCk7XG59XG5cbmZ1bmN0aW9uIHN0ZXBPcGVyYXRpb25JZkRvbmUodGFzaywgb3BlcmF0aW9uLCB2YWx1ZSkge1xuICByZXR1cm4gc3RlcE9wZXJhdGlvbkZpbmFsU3RlcCh0YXNrLCBvcGVyYXRpb24sIHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gY2FuY2VsVGFzayh0YXNrKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChjYW5jZWxPcGVyYXRpb25zKHRhc2spKTtcbn1cblxuZnVuY3Rpb24gaXNSdW5uaW5nKHRhc2tPck9wZXJhdGlvbikge1xuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgVGFzaykge1xuICAgIHJldHVybiBpc1Rhc2tSdW5uaW5nKHRhc2tPck9wZXJhdGlvbik7XG4gIH1cbiAgaWYgKHRhc2tPck9wZXJhdGlvbiBpbnN0YW5jZW9mIE9wZXJhdGlvbikge1xuICAgIHJldHVybiBpc09wZXJhdGlvblJ1bm5pbmcodGFza09yT3BlcmF0aW9uKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzQ2FuY2VsbGVkKHRhc2tPck9wZXJhdGlvbikge1xuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgVGFzaykge1xuICAgIHJldHVybiBpc1Rhc2tDYW5jZWxsZWQodGFza09yT3BlcmF0aW9uKTtcbiAgfVxuICBpZiAodGFza09yT3BlcmF0aW9uIGluc3RhbmNlb2YgT3BlcmF0aW9uKSB7XG4gICAgcmV0dXJuIGlzT3BlcmF0aW9uQ2FuY2VsbGVkKHRhc2tPck9wZXJhdGlvbik7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPcGVyYXRpb24odGFzaywgLi4uc3RhdGUpIHtcbiAgcmV0dXJuIG5ldyBPcGVyYXRpb24oeyB0YXNrLCBzdGF0ZSB9KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVRhc2soeyBnZW5lcmF0b3IsIGNvbnRleHQsIG1vZGUgfSkge1xuICByZXR1cm4gbmV3IFRhc2soeyBnZW5lcmF0b3IsIGNvbnRleHQsIG1vZGUgfSk7XG59XG5cbmZ1bmN0aW9uIF9jcmVhdGVUYXNrKGdlbmVyYXRvciwgY29udGV4dCwgbW9kZSkge1xuICByZXR1cm4gY3JlYXRlVGFzayh7IGdlbmVyYXRvciwgY29udGV4dCwgbW9kZSB9KTtcbn1cbmZ1bmN0aW9uIF9jYW5jZWxUYXNrKHRhc2spIHtcbiAgcmV0dXJuIGNhbmNlbFRhc2sodGFzayk7XG59XG5cbmV4cG9ydCB7IF9jcmVhdGVUYXNrIGFzIGNyZWF0ZVRhc2sgfTtcbmV4cG9ydCB7IF9jYW5jZWxUYXNrIGFzIGNhbmNlbFRhc2sgfTtcbiIsICJpbXBvcnQgY3VycnkgZnJvbSAnLi9jdXJyeS5qcyc7XG5cbmZ1bmN0aW9uIF90ZXN0KHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuIHJlZ2V4LnRlc3Qoc3RyaW5nKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdGVzdChzdHJpbmcsIHJlZ2V4KSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1tYWdpYy1udW1iZXJzXG4gIGlmIChhcmd1bWVudHMubGVudGVzdGggPT09IDEpIHtcbiAgICByZXR1cm4gY3VycnkoX3Rlc3QsIHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIF90ZXN0KHN0cmluZywgcmVnZXgpO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyaW0odGFyZ2V0KSB7XG4gIHJldHVybiB0YXJnZXQudHJpbSgpO1xufVxuIiwgImltcG9ydCBwaXBlbGluZSBmcm9tICcuL3BpcGVsaW5lLmpzJztcbmltcG9ydCBwaXBlIGZyb20gJy4vcGlwZS5qcyc7XG5pbXBvcnQgbGVuZ3RoIGZyb20gJy4vbGVuZ3RoLmpzJztcbmltcG9ydCBzbGljZSBmcm9tICcuL3NsaWNlLmpzJztcbmltcG9ydCBtYXRjaCBmcm9tICcuL21hdGNoLmpzJztcbmltcG9ydCBjb25kaXRpb25hbCBmcm9tICcuL2NvbmRpdGlvbmFsLmpzJztcbmltcG9ydCBhcHBlbmQgZnJvbSAnLi9hcHBlbmQuanMnO1xuaW1wb3J0IGd0IGZyb20gJy4vZ3QuanMnO1xuaW1wb3J0IGN1cnJ5IGZyb20gJy4vY3VycnkuanMnO1xuaW1wb3J0IGlzTm9uZSBmcm9tICcuL2lzLW5vbmUuanMnO1xuaW1wb3J0IGlzRW1wdHkgZnJvbSAnLi9pcy1lbXB0eS5qcyc7XG5cbi8vICgpPT57cmV0dXJuIHNsaWNlKHN0cmluZywgMCwgbWF4TGVuZ3RoKSArICdcdTIwMjYnfSxcblxuLy8gZXg6IFwiSGVsbG8gdGhpcyBpcyBBbmR5XCIgPT4gdHJ1bmNhdGVUb0xhc3RTcGFjZSgwLCAxMikgPT4gXCJIZWxsbyB0aGlzXHUyMDI2XCJcbi8vIGV4OiBcIkhlbGxvIHRoaXMgaXMgQW5keVwiID0+IHRydW5jYXRlVG9MYXN0U3BhY2UoMCwgMTMpID0+IFwiSGVsbG8gdGhpcyBpc1x1MjAyNlwiXG4vLyBleDogXCJIZWxsbyB0aGlzIGlzIEFuZHlcIiA9PiB0cnVuY2F0ZVRvTGFzdFNwYWNlKDAsIDE0KSA9PiBcIkhlbGxvIHRoaXMgaXNcdTIwMjZcIlxuLy8gZXg6IFwiSGVsbG8gdGhpcyBpcyBBbmR5XCIgPT4gdHJ1bmNhdGVUb0xhc3RTcGFjZSgwLCAxNSkgPT4gXCJIZWxsbyB0aGlzIGlzXHUyMDI2XCJcbmNvbnN0IHRydW5jYXRlVG9MYXN0U3BhY2UgPSBwaXBlbGluZSgoeyBzdHJpbmcsIG1heExlbmd0aCB9KSA9PiB7XG4gIGNvbnN0IGxhc3RDaGFyTWF0Y2ggPSBwaXBlKFxuICAgIHN0cmluZyxcbiAgICBzbGljZSgwLCBtYXhMZW5ndGgpLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItbmFtZWQtY2FwdHVyZS1ncm91cFxuICAgIG1hdGNoKC8oIClcXGIoXFx3KykkL3UpXG4gICk7XG4gIHJldHVybiBjb25kaXRpb25hbChcbiAgICBsYXN0Q2hhck1hdGNoLFxuICAgIGlzTm9uZSxcbiAgICAoKSA9PiB7XG4gICAgICByZXR1cm4gc2xpY2Uoc3RyaW5nLCAwLCBtYXhMZW5ndGggLSAxKTtcbiAgICB9LCAvLyBsYXN0IGNoYXIgaXMgYW4gc3BhY2VcbiAgICAoKSA9PiB7XG4gICAgICByZXR1cm4gc2xpY2Uoc3RyaW5nLCAwLCBsYXN0Q2hhck1hdGNoLmluZGV4KTtcbiAgICB9IC8vIGxhc3QgY2hhciBpcyBhbiBjaGFyXG4gICk7XG59LCBhcHBlbmQoJ1x1MjAyNicpKTtcblxuZnVuY3Rpb24gX3RydW5jYXRlKHN0cmluZywgbWF4TGVuZ3RoKSB7XG4gIGlmIChpc0VtcHR5KHN0cmluZykpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgcmV0dXJuIHBpcGUoXG4gICAgbGVuZ3RoKHN0cmluZyB8fCAnJyksXG4gICAgY29uZGl0aW9uYWwoXG4gICAgICBndChtYXhMZW5ndGgpLFxuICAgICAgdHJ1bmNhdGVUb0xhc3RTcGFjZSh7IHN0cmluZywgbWF4TGVuZ3RoIH0pLFxuICAgICAgc3RyaW5nXG4gICAgKVxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cnVuY2F0ZShzdHJpbmcsIG1heExlbmd0aCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWFnaWMtbnVtYmVyc1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBjdXJyeShfdHJ1bmNhdGUsIHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIF90cnVuY2F0ZShzdHJpbmcsIG1heExlbmd0aCk7XG59XG4iLCAiaW1wb3J0IG1hcCBmcm9tICcuL21hcC5qcyc7XG5pbXBvcnQgZmluZCBmcm9tICcuL2ZpbmQuanMnO1xuaW1wb3J0IGlzRW1wdHkgZnJvbSAnLi9pcy1lbXB0eS5qcyc7XG5pbXBvcnQgaXNGdW5jdGlvbiBmcm9tICcuL2lzLWZ1bmN0aW9uLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL2N1cnJ5LmpzJztcblxuZnVuY3Rpb24gSURFTlRJVFlfRk4oYSkge1xuICByZXR1cm4gYTtcbn1cblxuZnVuY3Rpb24gX3VuaXEobGlzdCwgZm4gPSBJREVOVElUWV9GTikge1xuICBpZiAoaXNFbXB0eShsaXN0KSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gbWFwKFsuLi5uZXcgU2V0KG1hcChsaXN0LCBmbikpXSwgKGspID0+IHtcbiAgICByZXR1cm4gZmluZChsaXN0LCAoZWwpID0+IHtcbiAgICAgIHJldHVybiBmbihlbCkgPT09IGs7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1bmlxKGxpc3QsIGZuID0gSURFTlRJVFlfRk4pIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW1hZ2ljLW51bWJlcnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgaXNGdW5jdGlvbihsaXN0KSkge1xuICAgIHJldHVybiBjdXJyeShfdW5pcSwgbGlzdCk7XG4gIH1cbiAgcmV0dXJuIF91bmlxKGxpc3QsIGZuKTtcbn1cbiIsICJleHBvcnQgZGVmYXVsdCBPYmplY3QudmFsdWVzO1xuIiwgImltcG9ydCBjb25kaXRpb25hbCBmcm9tICcuL2NvbmRpdGlvbmFsLmpzJztcbmltcG9ydCBpc0FycmF5IGZyb20gJy4vaXMtYXJyYXkuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjb25kaXRpb25hbChcbiAgaXNBcnJheSxcbiAgKGUpID0+IHtcbiAgICByZXR1cm4gZTtcbiAgfSxcbiAgKGUpID0+IHtcbiAgICByZXR1cm4gW2VdO1xuICB9XG4pO1xuIiwgImltcG9ydCBhbGxXaXRoIGZyb20gJy4vdXRpbHMvYWxsLXdpdGguanMnO1xuaW1wb3J0IGFsbCBmcm9tICcuL3V0aWxzL2FsbC5qcyc7XG5pbXBvcnQgYW55V2l0aCBmcm9tICcuL3V0aWxzL2FueS13aXRoLmpzJztcbmltcG9ydCBhbnkgZnJvbSAnLi91dGlscy9hbnkuanMnO1xuaW1wb3J0IGFwcGVuZCBmcm9tICcuL3V0aWxzL2FwcGVuZC5qcyc7XG5cbmltcG9ydCBib3RoIGZyb20gJy4vdXRpbHMvYm90aC5qcyc7XG5cbmltcG9ydCBjaHVuayBmcm9tICcuL3V0aWxzL2NodW5rLmpzJztcbmltcG9ydCBjb21wYWN0IGZyb20gJy4vdXRpbHMvY29tcGFjdC5qcyc7XG5pbXBvcnQgY29uY2F0IGZyb20gJy4vdXRpbHMvY29uY2F0LmpzJztcbmltcG9ydCBjb25kaXRpb25hbCBmcm9tICcuL3V0aWxzL2NvbmRpdGlvbmFsLmpzJztcbmltcG9ydCBjdXJyeSBmcm9tICcuL3V0aWxzL2N1cnJ5LmpzJztcblxuaW1wb3J0IGRlYnVnIGZyb20gJy4vdXRpbHMvZGVidWcuanMnO1xuXG5pbXBvcnQgZW50cmllcyBmcm9tICcuL3V0aWxzL2VudHJpZXMuanMnO1xuaW1wb3J0IGVxIGZyb20gJy4vdXRpbHMvZXEuanMnO1xuaW1wb3J0IGV4ZWMgZnJvbSAnLi91dGlscy9leGVjLmpzJztcbmltcG9ydCBleHRlbmQgZnJvbSAnLi91dGlscy9leHRlbmQuanMnO1xuXG5pbXBvcnQgZmlsdGVyQnkgZnJvbSAnLi91dGlscy9maWx0ZXItYnkuanMnO1xuaW1wb3J0IGZpbHRlciBmcm9tICcuL3V0aWxzL2ZpbHRlci5qcyc7XG5pbXBvcnQgZmluZEJ5SW5UcmVlIGZyb20gJy4vdXRpbHMvZmluZC1ieS1pbi10cmVlLmpzJztcbmltcG9ydCBmaW5kQnkgZnJvbSAnLi91dGlscy9maW5kLWJ5LmpzJztcbmltcG9ydCBmaW5kSW5UcmVlIGZyb20gJy4vdXRpbHMvZmluZC1pbi10cmVlLmpzJztcbmltcG9ydCBmaW5kIGZyb20gJy4vdXRpbHMvZmluZC5qcyc7XG5pbXBvcnQgZmlyc3QgZnJvbSAnLi91dGlscy9maXJzdC5qcyc7XG5pbXBvcnQgZmxhdHRlbiBmcm9tICcuL3V0aWxzL2ZsYXR0ZW4uanMnO1xuaW1wb3J0IGZvckVhY2ggZnJvbSAnLi91dGlscy9mb3ItZWFjaC5qcyc7XG5cbmltcG9ydCBncm91cEJ5IGZyb20gJy4vdXRpbHMvZ3JvdXAtYnkuanMnO1xuaW1wb3J0IGd0IGZyb20gJy4vdXRpbHMvZ3QuanMnO1xuaW1wb3J0IGd0ZSBmcm9tICcuL3V0aWxzL2d0ZS5qcyc7XG5cbmltcG9ydCBpZCBmcm9tICcuL3V0aWxzL2lkLmpzJztcblxuaW1wb3J0IGluY2x1ZGVzIGZyb20gJy4vdXRpbHMvaW5jbHVkZXMuanMnO1xuaW1wb3J0IGluamVjdFBpcGVsaW5lSWYgZnJvbSAnLi91dGlscy9pbmplY3QtcGlwZWxpbmUtaWYuanMnO1xuaW1wb3J0IGluamVjdFBpcGVsaW5lIGZyb20gJy4vdXRpbHMvaW5qZWN0LXBpcGVsaW5lLmpzJztcbmltcG9ydCBpbnN0YW50aWF0ZSBmcm9tICcuL3V0aWxzL2luc3RhbnRpYXRlLmpzJztcbmltcG9ydCBpc0FycmF5RW1wdHkgZnJvbSAnLi91dGlscy9pcy1hcnJheS1lbXB0eS5qcyc7XG5pbXBvcnQgaXNBcnJheSBmcm9tICcuL3V0aWxzL2lzLWFycmF5LmpzJztcbmltcG9ydCBpc0VtcHR5IGZyb20gJy4vdXRpbHMvaXMtZW1wdHkuanMnO1xuaW1wb3J0IGlzRnVuY3Rpb24gZnJvbSAnLi91dGlscy9pcy1mdW5jdGlvbi5qcyc7XG5pbXBvcnQgaXNOb25lIGZyb20gJy4vdXRpbHMvaXMtbm9uZS5qcyc7XG5pbXBvcnQgaXNOdW1iZXIgZnJvbSAnLi91dGlscy9pcy1udW1iZXIuanMnO1xuaW1wb3J0IGlzT2JqZWN0IGZyb20gJy4vdXRpbHMvaXMtb2JqZWN0LmpzJztcbmltcG9ydCBpc09iamVjdEVtcHR5IGZyb20gJy4vdXRpbHMvaXMtb2JqZWN0LWVtcHR5LmpzJztcbmltcG9ydCBpc1Byb21pc2UgZnJvbSAnLi91dGlscy9pcy1wcm9taXNlLmpzJztcbmltcG9ydCBpc1N0cmluZ0VtcHR5IGZyb20gJy4vdXRpbHMvaXMtc3RyaW5nLWVtcHR5LmpzJztcbmltcG9ydCBpc1N0cmluZyBmcm9tICcuL3V0aWxzL2lzLXN0cmluZy5qcyc7XG5cbmltcG9ydCBqb2luIGZyb20gJy4vdXRpbHMvam9pbi5qcyc7XG5cbmltcG9ydCBrZXlNYXAgZnJvbSAnLi91dGlscy9rZXktbWFwLmpzJztcbmltcG9ydCBrZXlzIGZyb20gJy4vdXRpbHMva2V5cy5qcyc7XG5cbmltcG9ydCBsYXN0IGZyb20gJy4vdXRpbHMvbGFzdC5qcyc7XG5pbXBvcnQgbGVuZ3RoIGZyb20gJy4vdXRpbHMvbGVuZ3RoLmpzJztcbmltcG9ydCBsb2cgZnJvbSAnLi91dGlscy9sb2cuanMnO1xuaW1wb3J0IGxvZ2dlciBmcm9tICcuL3V0aWxzL2xvZ2dlci5qcyc7XG5pbXBvcnQgbHQgZnJvbSAnLi91dGlscy9sdC5qcyc7XG5pbXBvcnQgbHRlIGZyb20gJy4vdXRpbHMvbHRlLmpzJztcblxuaW1wb3J0IG1hcEJ5IGZyb20gJy4vdXRpbHMvbWFwLWJ5LmpzJztcbmltcG9ydCBtYXAgZnJvbSAnLi91dGlscy9tYXAuanMnO1xuaW1wb3J0IG1hdGNoIGZyb20gJy4vdXRpbHMvbWF0Y2guanMnO1xuaW1wb3J0IG1lcmdlIGZyb20gJy4vdXRpbHMvbWVyZ2UuanMnO1xuXG5pbXBvcnQgbmVxIGZyb20gJy4vdXRpbHMvbmVxLmpzJztcbmltcG9ydCBub3RFbXB0eSBmcm9tICcuL3V0aWxzL25vdC1lbXB0eS5qcyc7XG5pbXBvcnQgbm90IGZyb20gJy4vdXRpbHMvbm90LmpzJztcblxuaW1wb3J0IG93blByb3BlcnRpZXMgZnJvbSAnLi91dGlscy9vd24tcHJvcGVydGllcy5qcyc7XG5cbmltcG9ydCBwYXJzZSBmcm9tICcuL3V0aWxzL3BhcnNlLmpzJztcbmltcG9ydCBwaXBlIGZyb20gJy4vdXRpbHMvcGlwZS5qcyc7XG5pbXBvcnQgcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbiBmcm9tICcuL3V0aWxzL3BpcGVsaW5lLXRyYW5zZm9ybWF0aW9uLmpzJztcbmltcG9ydCBwaXBlbGluZSBmcm9tICcuL3V0aWxzL3BpcGVsaW5lLmpzJztcbmltcG9ydCBwbHVjayBmcm9tICcuL3V0aWxzL3BsdWNrLmpzJztcbmltcG9ydCBwcm94eSBmcm9tICcuL3V0aWxzL3Byb3h5LmpzJztcblxuaW1wb3J0IHJhbmdlIGZyb20gJy4vdXRpbHMvcmFuZ2UuanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZSBmcm9tICcuL3V0aWxzL3JlY3Vyc2l2ZS5qcyc7XG5pbXBvcnQgcmVkdWNlIGZyb20gJy4vdXRpbHMvcmVkdWNlLmpzJztcbmltcG9ydCByZWplY3RCeSBmcm9tICcuL3V0aWxzL3JlamVjdC1ieS5qcyc7XG5pbXBvcnQgcmVqZWN0IGZyb20gJy4vdXRpbHMvcmVqZWN0LmpzJztcbmltcG9ydCByZXBsYWNlIGZyb20gJy4vdXRpbHMvcmVwbGFjZS5qcyc7XG5pbXBvcnQgcmV0dXJuTnVsbCBmcm9tICcuL3V0aWxzL3JldHVybi1udWxsLmpzJztcbmltcG9ydCByZXR1cm5WYWx1ZSBmcm9tICcuL3V0aWxzL3JldHVybi12YWx1ZS5qcyc7XG5cbmltcG9ydCBzYW1wbGVNYW55IGZyb20gJy4vdXRpbHMvc2FtcGxlLW1hbnkuanMnO1xuaW1wb3J0IHNhbXBsZSBmcm9tICcuL3V0aWxzL3NhbXBsZS5qcyc7XG5pbXBvcnQgc2xlZXAgZnJvbSAnLi91dGlscy9zbGVlcC5qcyc7XG5pbXBvcnQgc2xpY2UgZnJvbSAnLi91dGlscy9zbGljZS5qcyc7XG5pbXBvcnQgc29ydEJ5IGZyb20gJy4vdXRpbHMvc29ydC1ieS5qcyc7XG5pbXBvcnQgc29ydCBmcm9tICcuL3V0aWxzL3NvcnQuanMnO1xuaW1wb3J0IHNwbGl0IGZyb20gJy4vdXRpbHMvc3BsaXQuanMnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICcuL3V0aWxzL3N0cmluZ2lmeS5qcyc7XG5cbmltcG9ydCB7IGNyZWF0ZVRhc2ssIGNhbmNlbFRhc2sgfSBmcm9tICcuL3V0aWxzL3Rhc2suanMnO1xuaW1wb3J0IHRlc3QgZnJvbSAnLi91dGlscy90ZXN0LmpzJztcbmltcG9ydCB0b09iamVjdCBmcm9tICcuL3V0aWxzL3RvLW9iamVjdC5qcyc7XG5pbXBvcnQgdHJpbSBmcm9tICcuL3V0aWxzL3RyaW0uanMnO1xuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vdXRpbHMvdHJ1bmNhdGUuanMnO1xuXG5pbXBvcnQgdW5pcSBmcm9tICcuL3V0aWxzL3VuaXEuanMnO1xuXG5pbXBvcnQgdmFsdWVzIGZyb20gJy4vdXRpbHMvdmFsdWVzLmpzJztcblxuaW1wb3J0IHdyYXBXaXRoQXJyYXkgZnJvbSAnLi91dGlscy93cmFwLXdpdGgtYXJyYXkuanMnO1xuXG5leHBvcnQgeyBhbGxXaXRoIGFzIGFsbFdpdGggfTtcbmV4cG9ydCB7IGFsbCBhcyBhbGwgfTtcbmV4cG9ydCB7IGFueVdpdGggYXMgYW55V2l0aCB9O1xuZXhwb3J0IHsgYW55IGFzIGFueSB9O1xuZXhwb3J0IHsgYXBwZW5kIGFzIGFwcGVuZCB9O1xuZXhwb3J0IHsgYm90aCBhcyBib3RoIH07XG5leHBvcnQgeyBjaHVuayBhcyBjaHVuayB9O1xuZXhwb3J0IHsgY29tcGFjdCBhcyBjb21wYWN0IH07XG5leHBvcnQgeyBjb25jYXQgYXMgY29uY2F0IH07XG5leHBvcnQgeyBjb25kaXRpb25hbCBhcyBjb25kaXRpb25hbCB9O1xuZXhwb3J0IHsgY3JlYXRlVGFzayBhcyBjcmVhdGVUYXNrIH07XG5leHBvcnQgeyBjYW5jZWxUYXNrIGFzIGNhbmNlbFRhc2sgfTtcbmV4cG9ydCB7IGN1cnJ5IGFzIGN1cnJ5IH07XG5leHBvcnQgeyBkZWJ1ZyBhcyBkZWJ1ZyB9O1xuZXhwb3J0IHsgZW50cmllcyBhcyBlbnRyaWVzIH07XG5leHBvcnQgeyBlcSBhcyBlcSB9O1xuZXhwb3J0IHsgZXhlYyBhcyBleGVjIH07XG5leHBvcnQgeyBleHRlbmQgYXMgZXh0ZW5kIH07XG5leHBvcnQgeyBmaWx0ZXJCeSBhcyBmaWx0ZXJCeSB9O1xuZXhwb3J0IHsgZmlsdGVyIGFzIGZpbHRlciB9O1xuZXhwb3J0IHsgZmluZEJ5SW5UcmVlIGFzIGZpbmRCeUluVHJlZSB9O1xuZXhwb3J0IHsgZmluZEJ5IGFzIGZpbmRCeSB9O1xuZXhwb3J0IHsgZmluZEluVHJlZSBhcyBmaW5kSW5UcmVlIH07XG5leHBvcnQgeyBmaW5kIGFzIGZpbmQgfTtcbmV4cG9ydCB7IGZpcnN0IGFzIGZpcnN0IH07XG5leHBvcnQgeyBmbGF0dGVuIGFzIGZsYXR0ZW4gfTtcbmV4cG9ydCB7IGZvckVhY2ggYXMgZm9yRWFjaCB9O1xuZXhwb3J0IHsgZ3JvdXBCeSBhcyBncm91cEJ5IH07XG5leHBvcnQgeyBndCBhcyBndCB9O1xuZXhwb3J0IHsgZ3RlIGFzIGd0ZSB9O1xuZXhwb3J0IHsgaWQgYXMgaWQgfTtcbmV4cG9ydCB7IGluY2x1ZGVzIGFzIGluY2x1ZGVzIH07XG5leHBvcnQgeyBpbmplY3RQaXBlbGluZUlmIGFzIGluamVjdFBpcGVsaW5lSWYgfTtcbmV4cG9ydCB7IGluamVjdFBpcGVsaW5lIGFzIGluamVjdFBpcGVsaW5lIH07XG5leHBvcnQgeyBpbnN0YW50aWF0ZSBhcyBpbnN0YW50aWF0ZSB9O1xuZXhwb3J0IHsgaXNBcnJheUVtcHR5IGFzIGlzQXJyYXlFbXB0eSB9O1xuZXhwb3J0IHsgaXNBcnJheSBhcyBpc0FycmF5IH07XG5leHBvcnQgeyBpc0VtcHR5IGFzIGlzRW1wdHkgfTtcbmV4cG9ydCB7IGlzRnVuY3Rpb24gYXMgaXNGdW5jdGlvbiB9O1xuZXhwb3J0IHsgaXNOb25lIGFzIGlzTm9uZSB9O1xuZXhwb3J0IHsgaXNOdW1iZXIgYXMgaXNOdW1iZXIgfTtcbmV4cG9ydCB7IGlzT2JqZWN0IGFzIGlzT2JqZWN0IH07XG5leHBvcnQgeyBpc09iamVjdEVtcHR5IGFzIGlzT2JqZWN0RW1wdHkgfTtcbmV4cG9ydCB7IGlzUHJvbWlzZSBhcyBpc1Byb21pc2UgfTtcbmV4cG9ydCB7IGlzU3RyaW5nRW1wdHkgYXMgaXNTdHJpbmdFbXB0eSB9O1xuZXhwb3J0IHsgaXNTdHJpbmcgYXMgaXNTdHJpbmcgfTtcbmV4cG9ydCB7IGpvaW4gYXMgam9pbiB9O1xuZXhwb3J0IHsga2V5TWFwIGFzIGtleU1hcCB9O1xuZXhwb3J0IHsga2V5cyBhcyBrZXlzIH07XG5leHBvcnQgeyBsYXN0IGFzIGxhc3QgfTtcbmV4cG9ydCB7IGxlbmd0aCBhcyBsZW5ndGggfTtcbmV4cG9ydCB7IGxvZyBhcyBsb2cgfTtcbmV4cG9ydCB7IGxvZ2dlciBhcyBsb2dnZXIgfTtcbmV4cG9ydCB7IGx0IGFzIGx0IH07XG5leHBvcnQgeyBsdGUgYXMgbHRlIH07XG5leHBvcnQgeyBtYXBCeSBhcyBtYXBCeSB9O1xuZXhwb3J0IHsgbWFwIGFzIG1hcCB9O1xuZXhwb3J0IHsgbWF0Y2ggYXMgbWF0Y2ggfTtcbmV4cG9ydCB7IG1lcmdlIGFzIG1lcmdlIH07XG5leHBvcnQgeyBuZXEgYXMgbmVxIH07XG5leHBvcnQgeyBub3RFbXB0eSBhcyBub3RFbXB0eSB9O1xuZXhwb3J0IHsgbm90IGFzIG5vdCB9O1xuZXhwb3J0IHsgb3duUHJvcGVydGllcyBhcyBvd25Qcm9wZXJ0aWVzIH07XG5leHBvcnQgeyBwYXJzZSBhcyBwYXJzZSB9O1xuZXhwb3J0IHsgcGlwZSBhcyBwaXBlIH07XG5leHBvcnQgeyBwaXBlbGluZVRyYW5zZm9ybWF0aW9uIGFzIHBpcGVsaW5lVHJhbnNmb3JtYXRpb24gfTtcbmV4cG9ydCB7IHBpcGVsaW5lIGFzIHBpcGVsaW5lIH07XG5leHBvcnQgeyBwbHVjayBhcyBwbHVjayB9O1xuZXhwb3J0IHsgcHJveHkgYXMgcHJveHkgfTtcbmV4cG9ydCB7IHJhbmdlIGFzIHJhbmdlIH07XG5leHBvcnQgeyByZWN1cnNpdmUgYXMgcmVjdXJzaXZlIH07XG5leHBvcnQgeyByZWR1Y2UgYXMgcmVkdWNlIH07XG5leHBvcnQgeyByZWplY3RCeSBhcyByZWplY3RCeSB9O1xuZXhwb3J0IHsgcmVqZWN0IGFzIHJlamVjdCB9O1xuZXhwb3J0IHsgcmVwbGFjZSBhcyByZXBsYWNlIH07XG5leHBvcnQgeyByZXR1cm5OdWxsIGFzIHJldHVybk51bGwgfTtcbmV4cG9ydCB7IHJldHVyblZhbHVlIGFzIHJldHVyblZhbHVlIH07XG5leHBvcnQgeyBzYW1wbGVNYW55IGFzIHNhbXBsZU1hbnkgfTtcbmV4cG9ydCB7IHNhbXBsZSBhcyBzYW1wbGUgfTtcbmV4cG9ydCB7IHNsZWVwIGFzIHNsZWVwIH07XG5leHBvcnQgeyBzbGljZSBhcyBzbGljZSB9O1xuZXhwb3J0IHsgc29ydEJ5IGFzIHNvcnRCeSB9O1xuZXhwb3J0IHsgc29ydCBhcyBzb3J0IH07XG5leHBvcnQgeyBzcGxpdCBhcyBzcGxpdCB9O1xuZXhwb3J0IHsgc3RyaW5naWZ5IGFzIHN0cmluZ2lmeSB9O1xuZXhwb3J0IHsgdGVzdCBhcyB0ZXN0IH07XG5leHBvcnQgeyB0b09iamVjdCBhcyB0b09iamVjdCB9O1xuZXhwb3J0IHsgdHJpbSBhcyB0cmltIH07XG5leHBvcnQgeyB0cnVuY2F0ZSBhcyB0cnVuY2F0ZSB9O1xuZXhwb3J0IHsgdW5pcSBhcyB1bmlxIH07XG5leHBvcnQgeyB2YWx1ZXMgYXMgdmFsdWVzIH07XG5leHBvcnQgeyB3cmFwV2l0aEFycmF5IGFzIHdyYXBXaXRoQXJyYXkgfTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhbGxXaXRoLFxuICBhbGwsXG4gIGFueVdpdGgsXG4gIGFueSxcbiAgYXBwZW5kLFxuICBib3RoLFxuICBjaHVuayxcbiAgY29tcGFjdCxcbiAgY29uY2F0LFxuICBjb25kaXRpb25hbCxcbiAgY3JlYXRlVGFzayxcbiAgY2FuY2VsVGFzayxcbiAgY3VycnksXG4gIGRlYnVnLFxuICBlbnRyaWVzLFxuICBlcSxcbiAgZXhlYyxcbiAgZXh0ZW5kLFxuICBmaWx0ZXJCeSxcbiAgZmlsdGVyLFxuICBmaW5kQnlJblRyZWUsXG4gIGZpbmRCeSxcbiAgZmluZEluVHJlZSxcbiAgZmluZCxcbiAgZmlyc3QsXG4gIGZsYXR0ZW4sXG4gIGZvckVhY2gsXG4gIGdyb3VwQnksXG4gIGd0LFxuICBndGUsXG4gIGlkLFxuICBpbmNsdWRlcyxcbiAgaW5qZWN0UGlwZWxpbmVJZixcbiAgaW5qZWN0UGlwZWxpbmUsXG4gIGluc3RhbnRpYXRlLFxuICBpc0FycmF5RW1wdHksXG4gIGlzQXJyYXksXG4gIGlzRW1wdHksXG4gIGlzRnVuY3Rpb24sXG4gIGlzTm9uZSxcbiAgaXNOdW1iZXIsXG4gIGlzT2JqZWN0LFxuICBpc09iamVjdEVtcHR5LFxuICBpc1Byb21pc2UsXG4gIGlzU3RyaW5nRW1wdHksXG4gIGlzU3RyaW5nLFxuICBqb2luLFxuICBrZXlNYXAsXG4gIGtleXMsXG4gIGxhc3QsXG4gIGxlbmd0aCxcbiAgbG9nLFxuICBsb2dnZXIsXG4gIGx0LFxuICBsdGUsXG4gIG1hcEJ5LFxuICBtYXAsXG4gIG1hdGNoLFxuICBtZXJnZSxcbiAgbmVxLFxuICBub3RFbXB0eSxcbiAgbm90LFxuICBvd25Qcm9wZXJ0aWVzLFxuICBwYXJzZSxcbiAgcGlwZSxcbiAgcGlwZWxpbmVUcmFuc2Zvcm1hdGlvbixcbiAgcGlwZWxpbmUsXG4gIHBsdWNrLFxuICBwcm94eSxcbiAgcmFuZ2UsXG4gIHJlY3Vyc2l2ZSxcbiAgcmVkdWNlLFxuICByZWplY3RCeSxcbiAgcmVqZWN0LFxuICByZXBsYWNlLFxuICByZXR1cm5OdWxsLFxuICByZXR1cm5WYWx1ZSxcbiAgc2FtcGxlTWFueSxcbiAgc2FtcGxlLFxuICBzbGVlcCxcbiAgc2xpY2UsXG4gIHNvcnRCeSxcbiAgc29ydCxcbiAgc3BsaXQsXG4gIHN0cmluZ2lmeSxcbiAgdGVzdCxcbiAgdG9PYmplY3QsXG4gIHRyaW0sXG4gIHRydW5jYXRlLFxuICB1bmlxLFxuICB2YWx1ZXMsXG4gIHdyYXBXaXRoQXJyYXksXG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFlLG9CQUFvQixJQUFJO0FBQ3JDLFNBQU8sTUFBTSxHQUFHLFNBQVMsS0FBSyxRQUFRO0FBQUE7OztBQ0R6QixpQkFBaUIsUUFBUTtBQUN0QyxTQUFPLE1BQU0sUUFBUTtBQUFBOzs7QUNE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LFdBQVcsS0FBSyxXQUFXLE9BQU87QUFDOUMsV0FBTyxNQUFNLE9BQU87QUFBQTtBQUV0QixTQUFPLE1BQU0sTUFBTTtBQUFBOzs7QUMxQnJCLElBQU8saUJBQVEsT0FBTzs7O0FDR3RCLElBQU8sMEJBQVEsWUFDYixTQUNBLENBQUMsTUFBTTtBQUNMLFNBQU87QUFBQSxHQUVULENBQUMsTUFBTTtBQUNMLFNBQU8sQ0FBQztBQUFBOzs7QUNxTVosSUFBTyxjQUFRO0FBQUEsRUFDYjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
