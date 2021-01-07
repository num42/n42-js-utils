import curry from './curry.js';
import keyMap from './key-map.js';
import pipe from './pipe.js';
import reduce from './reduce.js';
import isNone from './is-none.js';

function _findInTree(node, findFn, nextNodesFn) {
  if (isNone(node)) {
    // eslint-disable-next-line no-undefined
    return undefined;
  }
  if (findFn(node)) {
    return node;
  }
  return pipe(
    node,
    nextNodesFn,
    reduce((acc, nextNode) => {
      if (acc) {
        return acc;
      }
      return _findInTree(nextNode, findFn, nextNodesFn);
    }, null)
  );
}

export default function findInTree(node, findFn, nextNodesFn) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_findInTree, node, keyMap('children'));
  }
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_findInTree, node, findFn);
  }
  return _findInTree(node, findFn, nextNodesFn);
}
