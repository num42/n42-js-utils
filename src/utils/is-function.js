export default function isFunction(fn) {
  return fn && {}.toString.call(fn) === '[object Function]';
}
