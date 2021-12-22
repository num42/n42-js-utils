export default function isPromise(obj) {
  return Boolean(obj) && typeof obj.then === 'function';
}
