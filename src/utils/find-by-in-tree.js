import curry from './curry.js';
import keyMap from './key-map.js';
import findInTree from './find-in-tree.js';

function _findByInTree(node, target, value, nextNodesFn) {
  const findValue = keyMap(target);
  return findInTree(
    node,
    (n) => {
      return findValue(n) === value;
    },
    nextNodesFn
  );
}

export default function findByInTree(node, target, value, nextNodesFn) {
  // find nodes in tree whoose target equals true, having children
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 1) {
    return curry(_findByInTree, node, true, keyMap('children'));
  }
  // find nodes in tree whoose target equals value, having children
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 2) {
    return curry(_findByInTree, node, target, keyMap('children'));
  }
  // find node
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 3) {
    return curry(_findByInTree, node, target);
  }
  return _findByInTree(node, target, value, nextNodesFn);
}
