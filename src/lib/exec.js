export default function exec(fn, args = []) {
  return (target) => {
    return target[fn](...args);
  };
}
