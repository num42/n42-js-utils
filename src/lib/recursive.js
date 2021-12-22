import curry from './curry.js';

// recursive implementation. beautiful and works, but is not as performant
// const _recursive = (arr, stopCondition, fn, accumulator)=>{
//   if(stopCondition(arr, accumulator)){return accumulator}
//   const {next, current} = fn(arr, accumulator)
//   return _recursive(next, stopCondition, fn, current)
// }

// unwrapped recursive to improve performance by not building a giant stack.
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

export default function recursive(arr, fn, stopCondition, accumulator) {
  // eslint-disable-next-line no-magic-numbers
  if (arguments.length === 3) {
    return curry(_recursive, arr, fn, stopCondition);
  }
  return _recursive(arr, fn, stopCondition, accumulator);
}
