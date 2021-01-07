export default function curry(fn, ...args) {
  return (a) => {
    return fn(a, ...args);
  };
}
